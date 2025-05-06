import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();

  playAudio(filePath: string, duration: number = 5000) {
    this.audio.src = filePath;
    this.audio.volume = 0.5;
    this.audio.play();
    // Stop audio after specified duration (in milliseconds)
    console.log("audio played");
    
    setTimeout(() => {
      this.audio.pause();
      this.audio.currentTime = 0; // Reset audio to start
    }, duration);
  }
}