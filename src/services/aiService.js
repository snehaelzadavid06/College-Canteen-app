// TODO: Integrate actual Google Gemini API here
// Documentation: https://ai.google.dev/docs

export const generateMenuSuggestions = async (weather, pastSales) => {
    // Mock response for the hackathon "happy path"
    return [
        { name: "Hot Corn Soup", reason: "It's rainy today!" },
        { name: "Spicy Noodles", reason: "Popular choice for cold weather" }
    ];
};

export const getChatResponse = async (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes("special")) {
        return "Today's special is the Hyderabadi Chicken Biriyani! 🍗 It's selling fast!";
    }
    if (msg.includes("veg")) {
        return "For vegetarians, we have Paneer Butter Masala and Veg Fried Rice today. 🥦";
    }
    if (msg.includes("wait") || msg.includes("rush")) {
        return "Current wait time is approximately 5 minutes. 12:45 slot is quite empty if you want to avoid the rush! 🕒";
    }

    return "I'm your Canteen AI Assistant! Ask me about the menu, wait times, or specials. 🤖";
};
