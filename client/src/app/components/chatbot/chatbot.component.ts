import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userInput = '';
  messages: any[] = [
    { sender: 'bot', text: 'Hi! Ask me anything about donations or available clothes.' }
  ];

  constructor(private http: HttpClient) {}

  sendMessage() {
    const msg = this.userInput.trim();
    if (!msg) return;

    this.messages.push({ sender: 'user', text: msg });
    this.userInput = '';

    this.http.post<any>('http://localhost:3000/api/chat', { message: msg })
      .subscribe((response) => {
        if (response.type === 'faq' || response.type === 'none') {
          this.messages.push({ sender: 'bot', text: response.answer });
        } else if (response.type === 'products') {
          const items = response.products.map((p: any) =>
            `${p.title} (${p.size}, ${p.color})`
          ).join(', ');
          this.messages.push({ sender: 'bot', text: `Here are some matches: ${items}` });
        }
      });
  }
}
