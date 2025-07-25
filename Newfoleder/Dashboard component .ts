// Add this method to your existing DashboardComponent class

// In your existing DashboardComponent, add this method:
handleSendMessage(text: string): void {
  const now = new Date();
  
  // Check if current discussion is disabled
  const currentDiscussion = this.getCurrentDiscussion(); // You'll need to implement this
  if (currentDiscussion && currentDiscussion.isDisabled) {
    // Show error message or toast
    console.log("Cannot send message to disabled conversation");
    return;
  }

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
    onThumbsUp: () => alert('👍 Merci !'),
    onThumbsDown: () => alert('👎 accord')
  };
  
  this.messages.push(userMsg);

  // Simulate bot response after delay
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
      onThumbsUp: () => alert('👍 Merci !'),
      onThumbsDown: () => alert('👎 accord')
    };
    this.messages.push(responseMsg);
  }, 1000);
}

// Add this method to get current discussion (you'll need to implement based on your logic)
private getCurrentDiscussion(): Discussion | null {
  // Implement logic to get current discussion
  // This might involve checking the current route, selected discussion, etc.
  return null; // Replace with actual implementation
}
