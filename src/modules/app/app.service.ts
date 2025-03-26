import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello World - NestJS</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          /* Background Tech Effect */
          body {
            background: black;
            overflow: hidden;
          }

          .background-tech::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.9) 70%);
            z-index: -2;
          }

          /* Tech Grid */
          .grid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: 50px 50px;
            background-image: linear-gradient(to right, rgba(255, 0, 0, 0.1) 2px, transparent 2px),
                              linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 2px, transparent 2px);
            z-index: -1;
            opacity: 0.4;
            animation: fadeInGrid 2s ease-in-out;
          }

          @keyframes fadeInGrid {
            0% { opacity: 0; transform: scale(1.1); }
            100% { opacity: 0.4; transform: scale(1); }
          }

          /* Glowing Diagonal Lines */
          .glow-line {
            position: absolute;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, rgba(255, 0, 0, 0), rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0));
            opacity: 0.7;
          }

          /* Left to Right Diagonal */
          .glow-line-left {
            top: -50%;
            left: 10%;
            transform: rotate(-45deg);
            animation: moveLineDiagonal 3s linear infinite;
          }

          .glow-line-left:nth-child(2) { left: 30%; animation-duration: 4s; }
          .glow-line-left:nth-child(3) { left: 50%; animation-duration: 5s; }

          /* Right to Left Diagonal */
          .glow-line-right {
            bottom: -50%;
            right: 10%;
            transform: rotate(45deg);
            animation: moveLineDiagonal 3s linear infinite reverse;
          }

          .glow-line-right:nth-child(2) { right: 30%; animation-duration: 4s; }
          .glow-line-right:nth-child(3) { right: 50%; animation-duration: 5s; }

          @keyframes moveLineDiagonal {
            0% { transform: translateY(-100%) rotate(-45deg); }
            100% { transform: translateY(100%) rotate(-45deg); }
          }

          /* Fade-in & Scale Animation */
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }

          .animate-fade-in {
            animation: fadeInScale 1s ease-out;
          }
        </style>
      </head>
      <body class="relative flex flex-col items-center justify-center h-screen text-white background-tech">

        <!-- Tech Grid -->
        <div class="grid-overlay"></div>

        <!-- Glowing Lines -->
        <div class="glow-line glow-line-left"></div>
        <div class="glow-line glow-line-left"></div>
        <div class="glow-line glow-line-left"></div>
        <div class="glow-line glow-line-right"></div>
        <div class="glow-line glow-line-right"></div>
        <div class="glow-line glow-line-right"></div>

        <!-- Logo NestJS -->
        <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS Logo" class="w-64 h-64 mb-6 animate-fade-in">

        <!-- Hello World Text -->
        <h1 class="text-9xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
          Hello World
        </h1>

      </body>
      </html>
    `;
  }
}
