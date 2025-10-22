# CivicLens Demo Mode 🎬

## Overview
An interactive, automated demo mode that showcases all features of the CivicLens application with realistic user interactions.

## How to Activate

### Method 1: Keyboard Shortcut
Press the **comma key (`,`)** anywhere in the application to start the demo.

### Method 2: Demo Hint Button
On the home page, a helpful hint card will appear after 2 seconds with a "Start Demo" button.

### To Exit
Press **ESC** at any time to exit the demo mode (demo runs completely invisibly with zero UI indicators).

## What the Demo Does

The demo automatically performs the following actions:

1. **Welcome Screen** - Shows an introduction overlay with smooth fade-in
2. **Home Tour** - Scrolls through the home page
3. **Upload Section** - Highlights the feedback upload area (subtle dark overlay only)
4. **Multi-Language Demo** - Submits feedback in 3 different languages:
   - **English**: "The new park needs better lighting and more accessibility features for everyone."
   - **Spanish**: "Necesitamos más transporte público en nuestra comunidad. Los autobuses son poco frecuentes."
   - **Chinese**: "社区中心应该延长开放时间，以便让更多居民可以参与活动."
5. **Process Each Submission** - Automatically clicks submit and waits for AI processing after each entry
6. **Navigate to Analytics** - Automatically switches to the Analytics page and waits for results to load
7. **Analytics Tour** - Smoothly scrolls through three key sections:
   - **Dashboard and Charts** - Shows metrics and sentiment visualization at top
   - **AI Processing Results** - Scrolls to show translations and analysis (heading near top)
   - **Policy Insights** - Scrolls to recommendations and export options (heading near top)
8. **Stay on Analytics** - Demo ends on the Policy Insights section showing all data

## Features

### Visual Indicators
- **Completely Invisible**: No welcome modal, no banners, no indicators at all
- **Smooth Highlight Effect**: Dark overlay fades in/out smoothly (700ms transitions) on upload section only
- **Clean Design**: Zero UI distractions during the demo
- **Seamless Experience**: Demo runs completely invisibly - viewers just see the app being used naturally
- **Professional Presentation**: Perfect for live demos and screen recordings

### Smart Interactions
- **Realistic Typing**: Character-by-character typing simulation at natural speed
- **Actual Form Submission**: Really submits feedback to the backend for AI processing (3 submissions)
- **Smooth Scrolling**: Animated scrolling between sections
- **Page Navigation**: Automatic routing between Home and Analytics
- **Gradual Highlighting**: Smooth 700ms fade-in and fade-out of dark overlay
- **Multi-Language Support**: Actually submits English, Spanish, and Chinese feedback for processing
- **Wait for Results**: Pauses on Analytics page to let processed data load and display

## Demo Steps

| Step | Action | Duration | Description |
|------|--------|----------|-------------|
| 1-6 | Introduction & Navigation | ~6s | Welcome, scroll to home, navigate to upload |
| 7-11 | English Feedback | ~9s | Type and submit English feedback |
| 12-16 | Spanish Feedback | ~9s | Type and submit Spanish feedback |
| 17-21 | Chinese Feedback | ~9s | Type and submit Chinese feedback |
| 22-24 | Navigate to Analytics | ~5s | Switch to analytics page and load data |
| 25 | Dashboard & Charts | ~3s | View sentiment analysis and metrics |
| 26 | AI Processing Results | ~3s | Scroll to translations section (heading at top) |
| 27 | Policy Insights | ~3s | Scroll to recommendations (heading at top) |
| 28 | Completion | ~1.5s | Demo ends on Policy Insights |

**Total Duration**: ~48 seconds (3 multilingual submissions + targeted analytics tour)

### Key Improvements:
- ✨ **Smooth Transitions**: All highlights fade in/out over 700ms (only on upload section)
- 🌍 **Multi-Language Demo**: Actually submits English, Spanish, and Chinese feedback
- 🎯 **Realistic Flow**: Waits for AI processing after each submission
- 💫 **Clean Design**: No distracting effects - just subtle darkening when highlighting
- 📊 **Real Data**: Submissions are processed and visible in Analytics page
- ⏳ **Patient Timing**: Waits on Analytics to show processed results
- 🏁 **Stays on Analytics**: Demo ends on Policy Insights (no return to home)
- 📍 **Smart Scrolling**: Section headings positioned near top of screen for clarity

## Technical Details

### Files Created
- `client/src/components/DemoMode.tsx` - Main demo orchestration
- `client/src/components/DemoHint.tsx` - Demo hint card on home page
- `DEMO-MODE-GUIDE.md` - This documentation

### Files Modified
- `client/src/App.tsx` - Added DemoMode component
- `client/src/pages/Home.tsx` - Added DemoHint component
- `client/src/pages/Analytics.tsx` - Added IDs for demo targeting
- `client/src/components/UploadSection.tsx` - Added IDs for demo targeting

### Key Technologies
- React hooks (useState, useEffect)
- Wouter for routing
- CSS animations and transitions
- DOM manipulation for realistic interactions
- Local storage for hint dismissal

## Customization

To modify the demo, edit the `demoSteps` array in `client/src/components/DemoMode.tsx`:

```typescript
const demoSteps: DemoStep[] = [
  { 
    type: 'type', 
    target: '#feedback-textarea', 
    text: 'Your custom text here',
    duration: 3000,
    description: 'Custom description'
  },
  // Add more steps...
];
```

### Available Step Types
- `navigate` - Change pages
- `scroll` - Scroll to element or position
- `type` - Simulate typing
- `click` - Click elements
- `wait` - Pause between actions
- `highlight` - Draw attention to elements

## User Experience

### First-Time Users
- Automatically see demo hint after 2 seconds
- Can start demo with one click
- Hint can be permanently dismissed

### Returning Users
- Hint won't show if previously dismissed
- Can always press `,` to start demo
- Demo resets each time it's started

## Accessibility
- Keyboard-accessible (comma key trigger)
- Clear visual indicators
- ESC key for quick exit
- No interference with normal app usage

---

Press `,` now to see it in action! 🚀

