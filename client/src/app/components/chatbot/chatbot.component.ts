import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  userInput = '';
  messages: ChatMessage[] = [];
  isOpen = false;
  isMinimized = false;
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Initialize with welcome message
    this.messages = [
      {
        sender: 'bot',
        text: 'Hi! I\'m your ReWear assistant. I can help you with:\n• Finding sustainable fashion items\n• Understanding how swaps work\n• Learning about points and redemption\n• General questions about ReWear\n\nWhat would you like to know?',
        timestamp: new Date()
      }
    ];
  }

  openChat() {
    this.isOpen = true;
    this.isMinimized = false;
  }

  closeChat() {
    this.isOpen = false;
    this.isMinimized = false;
  }

  minimizeChat() {
    this.isMinimized = true;
  }

  restoreChat() {
    this.isMinimized = false;
  }

  sendMessage() {
    const msg = this.userInput.trim();
    if (!msg || this.isLoading) return;

    // Add user message
    this.messages.push({
      sender: 'user',
      text: msg,
      timestamp: new Date()
    });

    this.userInput = '';
    this.isLoading = true;

    // Add loading message
    this.messages.push({
      sender: 'bot',
      text: '',
      timestamp: new Date(),
      isLoading: true
    });

    // Simulate API call (replace with actual chatbot API)
    setTimeout(() => {
      // Remove loading message
      this.messages.pop();
      
      // Add bot response
      const response = this.getBotResponse(msg);
      this.messages.push({
        sender: 'bot',
        text: response,
        timestamp: new Date()
      });
      
      this.isLoading = false;
    }, 1000);
  }

  private getBotResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('swap') || message.includes('exchange')) {
      return 'Swapping on ReWear is easy! When you find an item you want, you can request to swap by offering one of your own items in exchange. The other user will review your offer and can accept or decline. You can also redeem items using points you earn from listing your own items.';
    }
    
    if (message.includes('point') || message.includes('redeem')) {
      return 'Points are earned by listing items on ReWear. Each item you list gives you points that you can use to redeem other items. The points required vary based on the item\'s value and condition.';
    }
    
    if (message.includes('sustainable') || message.includes('eco')) {
      return 'ReWear promotes sustainable fashion by giving clothes a second life! By swapping and reusing clothing, we reduce textile waste and support circular fashion. Every swap helps the environment!';
    }
    
    if (message.includes('list') || message.includes('upload') || message.includes('add')) {
      return 'To list an item, go to the "List Item" page. You\'ll need to provide details like title, description, category, size, condition, and set the points required. Don\'t forget to upload clear photos!';
    }
    
    if (message.includes('browse') || message.includes('find') || message.includes('search')) {
      return 'You can browse all available items on the "Browse" page. Use the filters to find specific categories, sizes, or conditions. Click on any item to see full details and request a swap or redeem with points.';
    }
    
    if (message.includes('help') || message.includes('support')) {
      return 'I\'m here to help! You can ask me about:\n• How swapping works\n• Points and redemption\n• Listing items\n• Browsing items\n• Sustainable fashion\n\nOr check our Help Center for more detailed information.';
    }
    
    return 'Thanks for your question! I\'m still learning about ReWear. For now, I can help you understand how swapping works, points and redemption, listing items, and browsing the platform. What would you like to know more about?';
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessageText(text: string): string {
    return text.replace(/\n/g, '<br>');
  }
}
