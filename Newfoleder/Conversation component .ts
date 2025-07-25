import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { Toast } from 'src/app/helpers';
import { Discussion } from 'src/app/models/discussion';
import { customMessageData, Message, user } from 'src/app/models/message';
import { GlobalService } from 'src/app/services';
import { ChatWithService } from 'src/app/services/ChatWith/chatwith.service';
import { DiscussionService } from 'src/app/services/ChatWith/discussion.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { RatingComponent } from '../rating/rating.component';
import { ActivatedRoute } from '@angular/router';
import { _CdkPrivateStyleLoader } from '@angular/cdk/private';
import { ReloadDetectionService } from 'src/app/services/reload-detection.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  providers: [ChatWithService],
  standalone: false
})
export class ConversationComponent {
  discussionSubscription: Subscription;
  createResponseMessage: Subscription;
  messageToSend: Message;
  currentDiscussion: Discussion;
  public messages = new Array<any>();
  loading: boolean;
  headerStatus: string = "primary";
  headText: string;
  newCustomMessageData: customMessageData;

  public discussionIdToSendMessage: number;

  public currentUser: string = '';
  public message: string = '';
  messageComment: string = '';
  discussionId: number;

  @Input() header: string = 'Chat';
  @Input() showBotActions: boolean = true;
  @Input() showUserActions: boolean = true;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  constructor(protected chatService: ChatWithService,
    private dialogService: NbDialogService,
    protected discussionService: DiscussionService,
    private reloadDetectionService: ReloadDetectionService,
    private loadingSpinnerService: HelperService,
    private globalService: GlobalService,
    private signalRService: SignalRService) {

    if (this.reloadDetectionService.isRefreshed()) {
      this.discussionId = Number(sessionStorage.getItem("discussionId"));
      if (this.discussionId != undefined && this.discussionId > 0) {
        console.log("was refreshed");
        this.signalRService.sendDiscussionIdEvent(this.discussionId);
      }
    } else {
      console.log("navigation");
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.discussionSubscription = this.signalRService.getDiscussion().subscribe(disc => {
      this.discussionId = Number(this.route.snapshot.paramMap.get('id'));
      this.messages = [];
      this.currentDiscussion = disc;
      this.headerStatus = disc.messages.length >= 10 ? "danger" : "primary";
      this.headText = disc.messages.length >= 10 ? "You have reached the maximum number of requests, please create a new discussion" : this.currentDiscussion.name;
      disc.messages.forEach(x => {
        this.parseMessage(x);
      });
      this.loadingSpinnerService.setLoading(false);
      this.scrollToBottom();
      this.discussionId = disc.id;
      if (this.currentDiscussion.canRate) this.openRatingDiscussionModal();
    },
      (error) => this.loadingSpinnerService.setLoading(false)
    );

    this.createResponseMessage = this.signalRService.getMessage().subscribe(msg => {
      console.log("getMessage", msg);
      this.this.messages.pop();
      this.parseMessage(msg);
      this.scrollToBottom();
      this.loading = false;
    },
      (error) => this.loading = false
    );

    this.signalRService.receivedDiscussionEvent.subscribe((item) => {
      if (typeof item === 'object' && item > 0) {
        this.discussionId = item;
        this.signalRService.connectToDiscussion(this.discussionId);
        sessionStorage.setItem('discussionId', this.discussionId.toString());
      } else {
        this.currentDiscussion = undefined;
        this.discussionId = 0;
      }
    });
  }

  canSend(): boolean {
    // Check if current discussion is disabled
    if (this.currentDiscussion && this.currentDiscussion.isDisabled) {
      return false;
    }
    return this.messages && this.messages.some(msg => msg.loading);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        const el = this.scrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  onThumbsUpCallback(messageId) {
    return () => this.openRatingMessageModal(messageId);
  }

  submit(ref) {
    ref.close();
  }

  openRatingDiscussionModal() {
    this.dialogService.open(RatingComponent, {
      context: {
        data: { id: this.discussionId, type: "discussion" }
      }
    });
  }

  openRatingMessageModal(messageId: any) {
    this.dialogService.open(RatingComponent, {
      context: {
        data: { id: messageId, type: "message" }
      }
    });
  }

  getApplicationPicture(code) {
    switch (code) {
      case "Valkyrie": return "./assets/images/valkyrie-logo.png";
      case "COSMOS": return "./assets/images/cosmos-logo.png";
      case "user": return "./assets/images/g93130.png";
      default: return "";
    }
  }

  async handleSendMessage(event: any) {
    // Check if conversation is disabled
    if (this.currentDiscussion && this.currentDiscussion.isDisabled) {
      Toast.fire('❌ You have reached the maximum number of requests, please create a new discussion', 'error');
      return;
    }

    if (this.message.length >= 10) {
      Toast.fire('❌ You have reached the maximum number of requests, please create a new discussion', 'error');
    } else {
      this.messageToSend = new Message('user', event, 'text', true, new Date(),
        new user("user", this.getApplicationPicture("user")), "", this.discussionIdToSendMessage,
        new customMessageData(false, "", false, false));
      this.signalRService.SendMessageToDiscussion(this.discussionId, this.messageToSend);
      this.parseMessage(this.messageToSend);
      var typingMsg = new Message("COSMOS", "typing", "text", false, new Date(), new user("COSMOS", this.getApplicationPicture("COSMOS")), "", this.discussionIdToSendMessage,
        new customMessageData(false, "", false, true));
      this.parseMessage(typingMsg);
      this.scrollToBottom();
    }
    this.scrollToBottom();
  }

  parseMessage(message) {
    const userAvatar = message.sender ?? "COSMOS";

    this.messages.push({
      id: message.id,
      sender: message.sender,
      text: message.text,
      date: new Date(message.date),
      reply: message.reply,
      type: message.type,
      user: {
        name: message.sender,
        avatar: this.getApplicationPicture(userAvatar)
      },
      discussionId: this.discussionId,
      quote: message.quote,
      customMessageData: message.customMessageData,
      alreadyRated: message.alreadyRated,
      loading: message.loading
    });
  }
}
