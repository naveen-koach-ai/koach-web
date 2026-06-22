import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StrengthAspirationConversationPageRoutingModule } from './strength-aspiration-conversation-routing.module';
import { StrengthAspirationConversationPage } from './strength-aspiration-conversation.page';
import { QuestionComponent } from '../../common/components/question/question.component';
import { FlashcardsComponent } from '../../common/components/flashcards/flashcards.component';
import { ProgressbarComponent } from '../../common/components/progressbar/progressbar.component';
import { PageHeaderComponent } from '../../common/components/page-header/page-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StrengthAspirationConversationPageRoutingModule,
    QuestionComponent,
    FlashcardsComponent,
    ProgressbarComponent,
    PageHeaderComponent,
  ],
  declarations: [StrengthAspirationConversationPage]
})
export class StrengthAspirationConversationPageModule {}
