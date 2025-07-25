import { Component, EventEmitter, Optional, TemplateRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbSearchService } from '@nebular/theme';
import { Discussion } from 'src/app/models/discussion';
import { GlobalService } from 'src/app/services';
import { DiscussionService } from 'src/app/services/ChatWith/discussion.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { ApplicationSource } from 'src/app/models/applicationSource';
import { ListItemResponse } from 'src/app/models';
import { ApplicationSourceService } from 'src/app/services/ChatWith/applicationSource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RatingComponent } from '../rating/rating.component';
import { HelperService } from 'src/app/services/helper.service';
import { Subscription } from 'rxjs';
import { AuthorizeService } from 'src/app/services/AdminAndConfig/authorize.service';

@Component({
  selector: 'app-chat-conversation-list',
  templateUrl: './chat-conversation-list.component.html',
  styleUrls: ['./chat-conversation-list.component.scss'],
  standalone: false
})
export class ChatConversationListComponent {
  //#region add discussion
  discussionName: string = '';
  public applicationSource: ApplicationSource;
  public applicationSources = new Array<ApplicationSource>();
  public newDiscussion: Discussion;
  newDiscussionName: string = '';
  //#endregion

  //#region List discussion
  selectedItemIndex: number | null = null;
  //#endregion

  public activeDiscussions = new Array<Discussion>();
  public archivedDiscussions = new Array<Discussion>();
  public allDiscussions = new Array<Discussion>();
  public activeDiscussionId: number;
  public currentUser: string = "User1";
  public selectedDiscussionId: string = '';
  public messageContent: string = '';
  sub1: Subscription;
  user: any;

  constructor(
    private dialogService: NbDialogService,
    private discussionService: DiscussionService,
    private applicationSourceService: ApplicationSourceService,
    private globalService: GlobalService,
    private searchService: NbSearchService,
    private signalrService: SignalRService,
    private loadingSpinnerService: HelperService,
    private router: Router,
    private route: ActivatedRoute,
    @Optional() private dialogRef: NbDialogRef<any>
  ) {
    this.sub = this.helperService.selectDiscussions.subscribe(val => {
      this.loadingSpinnerService.setLoading(true);
    });
    this.newDiscussion = new Discussion(0, this.discussionName, '', new Date, new Date, true, '', 0, 0, 0, null, false, 0);
  }

  ngOnInit(): void {
    this.authorizeService.loadCurrentUser()
      .subscribe((user: any) => { this.user = user });
    this.applicationSourceService.getApplications().subscribe((result: ListItemResponse<ApplicationSource>) => this.parseApplicationSourceData(result));
    this.discussionName = '';
    // Load discussions
    this.loadAllDiscussions();
    this.discussionService.ratingUpdated.subscribe(data => {
      this.activeDiscussions.find(x => x.id == data.id).rate = data.rating;
    });
  }

  //region List discussion
  loadAllDiscussions(): void {
    this.loadingSpinnerService.setLoading(true);
    this.discussionService.getDiscussions(this.userProfile.code).subscribe((result: any) => {
      let items = this.fromQueryResultToDiscussionList(result).filter(x => x.isActive);
      let archived = this.fromQueryResultToDiscussionList(result).filter(x => !x.isActive);
      this.activeDiscussions = [...items];
      this.allDiscussions = [...this.fromQueryResultToDiscussionList(result)];
      console.log("loadAllDiscussions", this.activeDiscussions);
      let discussionId = Number(sessionStorage.getItem("discussionId"));
      let discussion = this.activeDiscussions.find(x => x.id == discussionId);
      let index = this.activeDiscussions.indexOf(discussion);
      this.activeDiscussions.forEach((item, i) => {
        item.selected = (i === index);
      });
      this.selectedItemIndex = index;
      this.loadingSpinnerService.setLoading(false);
    });
  }

  fromQueryResultToDiscussionList(result: any): Array<Discussion> {
    let items = new Array<Discussion>();
    result.items.map((item: any) => {
      let disc = new Discussion(item.item.id, item.item.name, item.item.userId,
        item.item.startDate, item.item.endDate, item.item.isActive, item.item.formattedEndDate,
        item.item.totalTokens, item.item.totalCost, item.item.completionTokens, item.item.totalCost, item.item.message, false, item.item.rate);
      disc.totalMessages = item.item.totalMessages;
      items.push(disc);
    });
    return items;
  }

  //#endregion

  submit(ref) {
    ref.close();
    console.log(this.newDiscussionName);
    var discussion = this.activeDiscussions.find(x => x.id.toString() === this.selectedDiscussionId);
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
    console.log(discussion);
  }

  openEditDiscussionDialog(chatdialog: TemplateRef<any>, discussionId) {
    this.newDiscussionName = '';
    this.selectedDiscussionId = discussionId;
    this.dialogService.open(
      chatdialog,
      {
        context: 'this is some additional data passed to dialog',
        closeOnBackdropClick: false,
      });
  }

  openNewrateDialog() {
    this.dialogService.open(RatingComponent).onClose.subscribe(x => {
      if (x) {
        console.log("rating :", x);
      }
    });
  }

  enableDiscussion(discussionId: number) {
    let command = {
      discussionId: discussionId,
      active: true
    };
    this.discussionService.disableDiscussion(command).subscribe(x => {
      this.allDiscussions.forEach(element => {
        if (element.id == discussionId) {
          console.log("element disabled");
          element.isActive = true;
        }
      });
      this.archivedDiscussions = this.allDiscussions.filter(x => !x.isActive);
      this.activeDiscussions = this.allDiscussions.filter(x => x.isActive);
      // this.signalRService.sendDiscussionIdEvent(0);
      this.signalRService.sendDiscussionIdEvent(0);
    });
  }

  disableDiscussion(discussionId: number) {
    this.loadingSpinnerService.setLoading(true);
    let command = {
      discussionId: discussionId,
      active: false
    };
    this.discussionService.disableDiscussion(command).subscribe(x => {
      this.allDiscussions.forEach(element => {
        if (element.id == discussionId) {
          element.isActive = false;
          element.isDisabled = true; // Mark as disabled for old conversations
        }
      });
      this.archivedDiscussions = this.allDiscussions.filter(x => !x.isActive);
      this.activeDiscussions = this.allDiscussions.filter(x => x.isActive);
      // Clear current conversation if it's the disabled one
      if (this.activeDiscussionId === discussionId) {
        this.signalRService.sendDiscussionIdEvent(0);
      }
      this.loadingSpinnerService.setLoading(false);
    });
  }

  changeDiscussion(discussionId: number, index: number) {
    // Check if discussion is disabled
    const discussion = this.activeDiscussions.find(d => d.id === discussionId);
    if (discussion && discussion.isDisabled) {
      // Don't allow switching to disabled conversations
      return;
    }

    this.loadingSpinnerService.setLoading(true);
    this.signalRService.sendDiscussionIdEvent(discussionId);
    this.activeDiscussions.forEach((item, i) => {
      console.log(item, selected = (i === index));
      item.selected = (i === index);
    });
    this.selectedItemIndex = index;
    this.activeDiscussionId = discussionId;
    this.router.navigate(['/pages/chat/discussion/', discussionId]).then(success => {
      if (!success)
        this.signalRService.disconnectFromDiscussion(discussionId.toString());
    });
  }

  getApplicationPicture(code) {
    switch (code) {
      case "Valkyrie": return "./assets/images/valkyrie-logo.png";
      case "COSMOS": return "./assets/images/cosmos-logo.png";
      case "g93130": return "./assets/images/g93130.png";
      default: return "";
    }
  }

  //#region Add new discussion
  changeApplication(appId: number): void {
    this.applicationSource = this.applicationSources.find(x => x.id == appId);
  }

  createDiscussion() {
    this.signalrService.createDiscussion("new discussion").then(discussionId => {
      if (discussionId !== -1) {
        this.newDiscussion.id = discussionId;
        this.newDiscussion.name = " new discussion";
        this.activeDiscussions.push(this.newDiscussion);
      }
    });
  }

  parseApplicationSourceData(result: ListItemResponse<ApplicationSource>): void {
    let items = new Array<ApplicationSource>();
    result.items.map((item: ItemResponse<ApplicationSource>) => {
      items.push(new ApplicationSource(item.item.id, item.item.code, item.item.name, item.item.environnement, item.item.imagePath));
    });
    this.applicationSources = [...items];
  }

  parseValidationErrors(errors: any): void {
    let parsedErrors = JSON.parse(errors);
    this.applicationSource = parsedErrors.appName;
  }
  //#endregion
}
