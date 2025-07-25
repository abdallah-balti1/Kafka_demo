import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, user, CustomMessageData } from 'src/app/models/message';
import { ChatWithService } from 'src/app/services/ChatWith/chatwith.service';
import { AuthorizeService } from 'src/app/services/AdminAndConfig/authorize.service';
import { HelperService } from 'src/app/services/helper.service';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  @FormInputGroup
  transcription: string;
  recognitionActive = false;
  userany;
  //private recognition: SpeechRecognition;
  
  constructor(
    private loadingSpinnerService: HelperService,
    private chatWithService: ChatWithService,
    private router: Router, private fb: FormBuilder,
    private helperService: HelperService,
    private authorizeService: AuthorizeService,
    private signalRService: SignalRService) {
    
    this.form = this.fb.group({
      message: ['', Validators.required]
    });
    
    sessionStorage.removeItem('wasRefreshed');
    sessionStorage.removeItem('discussionId');
    //this.recognition = recognition;
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;*/
  }

  ngOnInit(): void {
    this.authorizeService.loadCurrentUser()
      .subscribe((user: any) => { this.user = user });
    
    this.loadingSpinnerService.setLoading(false);
  }

  createDiscussion() {
    if (this.form.valid) {
      this.helperService.setLoading(true);
      this.signalRService.createDiscussion("new discussion").then(discussionId => {
        if (discussionId !== -1) {
          console.log("createDiscussion", discussionId);
          
          let messageToSend = new Message('user', this.form.value.message, 'text', true, new Date(),
            new User(this.user.uid, "./assets/images/cosmos-logo.png"), "", discussionId, 
            new CustomMessageData ("", "", false, false));
          
          this.signalRService.SendMessageToDiscussion(discussionId, messageToSend);
          this.router.navigate(['/pages/chat/discussion/', discussionId]).then(success => {
            if (success) {
              this.signalRService.sendDiscussionIdEvent(discussionId);
            } else {
              console.log("navigate not ok");
            }
          });
        }
      });
    }
  }

  messages: any[] = [];

  userAvatar = 'https://i.pravatar.cc/150?img=3';
  botAvatar = 'https://i.pravatar.cc/150?img=1';

  handleSendMessage(text: string): void {
    const now = new Date();

    const userMsg = {
      message: text,
      reply: false,
      date: now,
      avatar: this.userAvatar,
      customMessage: Math.random() > 0.5 ? {
        type: 'link',
        label: 'Voir plus'
      } : {
        type: 'button',
        label: 'Action bot'
      },
      onThumbUp: () => alert('👍 Merci !'),
      onThumbDown: () => alert('👎 accord')
    };
    this.messages.push(userMsg);

    setTimeout(() => {
      const responseMsg = {
        message: 'Réponse du bot à: ' + text,
        reply: true,
        date: new Date(),
        avatar: this.botAvatar,
        customMessage: Math.random() > 0.5 ? {
          type: 'link',
          label: 'Voir plus'
        } : {
          type: 'button',
          label: 'Action bot'
        },
        onThumbUp: () => alert('👍 Merci !'),
        onThumbDown: () => alert('👎 accord')
      };
      this.messages.push(responseMsg);
    }, 1000);
  }

  startDictation() {
    /* this.transcription = '';
    this.recognitionActive = true;
    fromEvent(this.recognition, 'end').subscribe(() => {
      this.recognitionActive = false
    });
    fromEvent(this.recognition, 'error').subscribe((err) => {
      this.recognitionActive = false
    });

    stopDictation(){
    //this.recognition.stop();
    }

    ngOnInit(): void {
    this.authorizeService.loadCurrentUser()
    .subscribe((user: any) => { this.user = user });

    this.loadingSpinnerService.setLoading(false);
    }

    createDiscussion(){
    if(this.form.valid){
    this.helperService.setLoading(true);
    this.signalRService.createDiscussion("new discussion").then( discussionId => {
    if(discussionId !== -1){
    console.log("createDiscussion" ,discussionId)
    let messageToSend = new Message('user',this.form.value.message, 'text',true,new Date(),
    new user(this.user.uid, "./assets/images/cosmos-logo.png"), "", discussionId,
    new CustomMessageData ("","", false, false);
    this.signalRService.SendMessageToDiscussion(discussionId, messageToSend)
    this.router.navigate(['/pages/chat/discussion/', discussionId]).then(success => {
    if(success)
    this.signalRService.sendDiscussionIdEvent(discussionId);
    }else
    console.log("navigate not ok")
    }
    });
    }
    });
    }
    }

    messages: any[] = [];

    userAvatar = 'https://i.pravatar.cc/150?img=3';
    botAvatar = 'https://i.pravatar.cc/150?img=1';

    handleSendMessage(text: string): void {
    const now = new Date();

    const userMsg = {
    message: text,
    reply: false,
    date: now,
    avatar: this.userAvatar,
    customMessage: Math.random() > 0.5 ? {
    type: 'link',
    label: 'Voir plus'
    } : {
    type: 'button',
    label: 'Action bot'
    },
    onThumbUp: () => alert('👍 Merci !'),
    onThumbDown: () => alert('👎 accord')
    };
    this.messages.push(userMsg);

    setTimeout(() => {
    const responseMsg = {
    message: 'Réponse du bot à: ' + text,
    reply: true,
    date: new Date(),
    avatar: this.botAvatar,
    customMessage: Math.random() > 0.5 ? {
    type: 'link',
    label: 'Voir plus'
    } : {
    type: 'button',
    label: 'Action bot'
    },
    onThumbUp: () => alert('👍 Merci !'),
    onThumbDown: () => alert('👎 accord')
    };
    this.messages.push(responseMsg);
    }, 1000);
    }*/
  }
}
