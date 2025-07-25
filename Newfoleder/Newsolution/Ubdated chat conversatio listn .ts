import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { Discussion } from 'src/app/models/discussion';
import { DiscussionService } from 'src/app/services/ChatWith/discussion.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { ApplicationSource } from 'src/app/models/applicationSource';
import { ItemResponse, ListItemResponse } from 'src/app/models';

@Component({
  selector: 'app-chat-conversation-list',
  templateUrl: './chat-conversation-list.component.html',
  styleUrls: ['./chat-conversation-list.component.scss'],
  standalone: false
})
export class ChatConversationListComponent {
  //region add discussion
  discussionName: string = '';
  public applicationSource: ApplicationSource;
  public applicationSources = new Array<ApplicationSource>();
  public newDiscussion: Discussion;
  newDiscussionName: string = '';
  //endregion

  //region List discussion
  selectedItemIndex: number | null = null;
  //endregion

  public activeDiscussions = new Array<Discussion>();
  public archivedDiscussions = new Array<Discussion>();
  public allDiscussions = new Array<Discussion>();
  public activeDiscussionId: number;
  public currentUser: string = "User1";
  public selectedDiscussionId: string = '';
  public messageContent: string = '';
  
  @Input() user: any;

  constructor(
    private dialogService: NbDialogService,
    private discussionService: DiscussionService,
    private applicationSourceService: ApplicationSourceService,
    private globalService: GlobalService,
    private searchService: NbSearchService,
    private signalRService: SignalRService,
    private loadingSpinnerService: HelperService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser()
      .subscribe((user: any) => { this.user = user });
    
    this.parseApplicationSourceData(result);
    this.loadAllDiscussions();
    this.loadDiscussions();
    this.discussionService.ratingUpdatedR.subscribe(data => {
      this.activeDiscussions.find(x => x.id == data.id).rate = data.rating;
    });
  }

  parseApplicationSourceData(result: ListItemResponse<ApplicationSource>): void {
    let items = new Array<ApplicationSource>();
    result.items.map((item: ItemResponse<ApplicationSource>) => {
      items.push(new ApplicationSource(item.item.id, item.item.code, item.item.name, item.item.environment, item.item.imagePath));
    });
    this.applicationSources = [...items];
  }

  parseValidationErrors(errors: any): void {
    let parsedErrors = JSON.parse(errors);
    this.applicationSource = parsedErrors.appName;
  }

  submit(ref): void {
    ref.close();
    console.log(this.newDiscussionName);
    var discussion = this.activeDiscussions.find(x => x.id.toString() == this.selectedDiscussionId);
    discussion.name = this.newDiscussionName;
    var data = {
      discussionId: discussion.id,
      name: discussion.name,
      userId: discussion.userId,
      startDate: discussion.startDate,
      endDate: discussion.endDate,
      isActive: discussion.isActive,
      currentUserId: discussion.userId
    };
    this.discussionService.updateDiscussion(data).subscribe(x => console.log(x));
  }

  openEditDiscussionDialog(chatdialog: TemplateRef<any>, discussionId): void {
    this.newDiscussionName = "";
    this.selectedDiscussionId = discussionId;
    this.dialogService.open(
      chatdialog,
      {
        context: 'this is some additional data passed to dialog',
        closeOnBackdropClick: false,
      });
  }

  openNewrateDialog(): void {
    this.dialogService.open(RatingComponent).onClose.subscribe(x => {
      if (x) {
        console.log("rating :", x);
      }
    });
  }

  enableDiscussion(discussionId: number): void {
    // First, disable all discussions
    this.disableAllDiscussions();
    
    let command = {
      discussionId: discussionId,
      active: true
    };
    this.discussionService.disableDiscussion(command).subscribe(x => {
      this.allDiscussions.forEach(element => {
        if (element.id == discussionId) {
          console.log("element disabled");
          element.isActive = true;
        } else {
          element.isActive = false; // Disable all other discussions
        }
      });
      this.archivedDiscussions = this.allDiscussions.filter(x => !x.isActive);
      this.activeDiscussions = this.allDiscussions.filter(x => x.isActive);
      this.signalRService.sendDiscussionIdEvent(discussionId);
    });
    this.loadingSpinnerService.setLoading(false);
  }

  disableAllDiscussions(): void {
    this.allDiscussions.forEach(discussion => {
      if (discussion.isActive) {
        let command = {
          discussionId: discussion.id,
          active: false
        };
        this.discussionService.disableDiscussion(command).subscribe();
        discussion.isActive = false;
      }
    });
  }

  disableDiscussion(discussionId: number): void {
    this.loadingSpinnerService.setLoading(true);
    let command = {
      discussionId: discussionId,
      active: false
    };
    this.discussionService.disableDiscussion(command).subscribe(x => {
      this.allDiscussions.forEach(element => {
        if (element.id == discussionId) {
          element.isActive = false;
        }
      });
      this.archivedDiscussions = this.allDiscussions.filter(x => !x.isActive);
      this.activeDiscussions = this.allDiscussions.filter(x => x.isActive);
      this.loadingSpinnerService.setLoading(false);
    });
  }

  changeDiscussion(discussionId: number, index: number): void {
    this.loadingSpinnerService.setLoading(true);
    
    // First disable the currently active discussion
    const currentActiveDiscussion = this.allDiscussions.find(d => d.isActive);
    if (currentActiveDiscussion && currentActiveDiscussion.id !== discussionId) {
      this.disableDiscussion(currentActiveDiscussion.id);
    }
    
    // Enable the selected discussion
    this.signalRService.sendDiscussionIdEvent(discussionId);
    this.activeDiscussions.forEach((item, i) => {
      console.log(item, selected = (i === index));
      item.selected = (i === index);
    });
    this.selectedItemIndex = index;
    this.activeDiscussionId = discussionId;
    
    // Enable only this discussion
    this.enableDiscussion(discussionId);
    
    this.router.navigate(['/pages/chat/discussion/', discussionId]).then(success => {
      if (success) {
        this.signalRService.disconnectFromDiscussion(discussionId.toString());
      } else {
        console.log("navigate not ok");
      }
    });
  }

  getApplicationPicture(code): string {
    switch (code) {
      case "Valkyrie": return "./assets/images/valkyrie-logo.png";
      case "COSMOS": return "./assets/images/cosmos-logo.png";
      case "893130": return "./assets/images/893130.png";
      default: return "";
    }
  }

  //region Add new discussion
  changeApplication(appId: number): void {
    this.applicationSource = this.applicationSources.find(x => x.id == appId);
  }

  createDiscussion(): void {
    // Disable all existing discussions before creating new one
    this.disableAllDiscussions();
    
    this.signalRService.createDiscussion("new discussion").then(discussionId => {
      if (discussionId !== -1) {
        console.log("createDiscussion", discussionId);
        let messageToSend = new Message('user', this.getApplicationPicture("user"), "", this.discussionIdToSendMessage,
          new User("user", this.getApplicationPicture("user")), "", false, false);
        this.signalRService.SendMessageToDiscussion(this.discussionId, messageToSend);
        this.routerActivatedRoute.navigate(['/pages/chat/discussion/', discussionId]).then(success => {
          if (success) {
            this.signalRService.sendDiscussionIdEvent(discussionId);
          } else {
            console.log("navigate not ok");
          }
        });
      }
    });
  }

  loadAllDiscussions(): void {
    this.loadingSpinnerService.setLoading(true);
    this.discussionService.getDiscussions(this.userprofile.code).subscribe((result: any) => {
      let items = this.fromQueryResultToDiscussionList(result);
      let archived = [...items];
      this.archivedDiscussions = [...archived];
      this.allDiscussions = [...this.fromQueryResultToDiscussionList(result)];
      console.log("loadAllDiscussions", this.activeDiscussions);
      let discussionId = Number(sessionStorage.getItem("discussionId"));
      let discussion = this.activeDiscussions.find(x => x.id == discussionId);
      let index = this.activeDiscussions.indexOf(discussion);
      this.activeDiscussions.forEach((item, i) => {
        item.selected = (i == index);
      });
      this.selectedItemIndex = index;
      this.loadingSpinnerService.setLoading(false);
    }, (error) => this.loadingSpinnerService.setLoading(false));
  }

  fromQueryResultToDiscussionList(result: any): Array<Discussion> {
    let items = new Array<Discussion>();
    result.items.map((item: any) => {
      let disc = new Discussion(item.item.id, item.item.name, item.item.userId,
        item.item.startDate, item.item.endDate, item.item.isActive, item.item.formattedEndDate,
        item.item.totalTokens, item.item.formattedStartDate, item.item.completionTokens, item.item.totalCost, item.item.message, false, item.item.rate);
      disc.totalMessages = item.item.totalMessages;
      items.push(disc);
    });
    return items;
  }

  loadDiscussions(): void {
    this.loadingSpinnerService.setLoading(true);
    this.discussionService.getDiscussions(this.userprofile.code).subscribe((result: any) => {
      let items = this.fromQueryResultToDiscussionList(result).filter(x => x.isActive);
      let archived = this.fromQueryResultToDiscussionList(result).filter(x => !x.isActive);
      this.activeDiscussions = [...items];
      this.archivedDiscussions = [...archived];
      this.allDiscussions = [...this.fromQueryResultToDiscussionList(result)];
      console.log("loadAllDiscussions", this.activeDiscussions);
      let discussionId = Number(sessionStorage.getItem("discussionId"));
      let discussion = this.activeDiscussions.find(x => x.id == discussionId);
      let index = this.activeDiscussions.indexOf(discussion);
      this.activeDiscussions.forEach((item, i) => {
        item.selected = (i == index);
      });
      this.selectedItemIndex = index;
      this.loadingSpinnerService.setLoading(false);
    }, (error) => this.loadingSpinnerService.setLoading(false));
  }

  // Check if a discussion is the active one
  isActiveDiscussion(discussionId: number): boolean {
    return this.allDiscussions.find(d => d.id === discussionId)?.isActive || false;
  }

  // Check if user can chat in this discussion (only active discussions allow chatting)
  canChatInDiscussion(discussionId: number): boolean {
    return this.isActiveDiscussion(discussionId);
  }
}
