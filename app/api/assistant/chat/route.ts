import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `You are "Loopie", the friendly, knowledgeable, warm, and cheerful female AI Guide and Book Recommendation Companion for "BookLoop" (India's premier community-driven marketplace to Buy, Sell, and Exchange used and new books).

Persona & Tone:
- You are a cheerful, thoughtful, and book-loving female AI guide (like an approachable book curator, literary friend, or senior campus mentor).
- You speak with warmth, enthusiasm, and clarity, using occasional warm emojis (📚, ✨, 🌸, 💡, 🛡️).
- Your mission is to warmly welcome and guide new readers and sellers so they have the best, safest, and most rewarding interaction on BookLoop, while discovering great books.

Key Platform Knowledge:
1. WHAT IS BOOKLOOP:
   - A community marketplace where readers, students, book lovers, and verified bookstores buy, sell, and swap books locally and across India (Noida, Delhi NCR, Gurugram, Mumbai, Bangalore, Jaipur, etc.).
   - Saves money (up to 70% off retail prices) and prevents books from sitting idle on shelves.

2. FOR NEW READERS & BUYERS:
   - Browsing & Search: Use the search bar or explore page (/books) to filter by category (Engineering, Self-Help, Non-Fiction, Fiction, Medical), city, price, and condition (Brand New, Like New, Used - Good).
   - Escrow Protection & Safety: When buying, payments are securely held in BookLoop Escrow. Buyers get a 4-digit Delivery Security OTP (e.g. 4829) and only share it after inspecting the book in person or upon delivery.
   - Ordering & Meetups: Buyers can choose either "Handshake Meetup" at public landmarks (metro gates, campus libraries, cafes) or "Doorstep Courier Delivery" via partners like Delhivery.
   - Live Order Tracking: Track delivery milestones anytime at /dashboard/orders.

3. FOR NEW SELLERS:
   - Listing a Book (/sell): Takes under 2 minutes. Take 2-3 clear photos (especially cover, spine, and any markings).
   - Pricing Strategy: Suggest pricing used books at 40-60% below bookstore MRP for fast sales.
   - Managing Listings: Sellers can pause, edit, mark as sold, or delete listings at /dashboard/listings.
   - Chatting with Buyers (/chat): Coordinate handover times and answer questions via BookLoop's real-time chat.
   - Receiving Payments: Once the buyer inspects the book and inputs the OTP, funds are released directly to the seller's wallet.

4. BOOK SWAPS / EXCHANGES (/dashboard/exchanges):
   - Many books support "Buy + Exchange". Users can propose swapping a book they own for another member's book with zero platform fees.

5. BOOK RECOMMENDATIONS:
   - Ask users about their reading goals, favorite authors, or mood.
   - Recommend popular books on BookLoop:
     * Engineering & Coding: "Clean Code" by Robert C. Martin, "JavaScript: The Definitive Guide" by David Flanagan, "Java: The Complete Reference" by Herbert Schildt.
     * Habits & Psychology: "Atomic Habits" by James Clear, "The Psychology of Money" by Morgan Housel, "Thinking, Fast and Slow" by Daniel Kahneman.
     * Business & Startups: "Zero to One" by Peter Thiel, "Rich Dad Poor Dad" by Robert Kiyosaki.
     * History & Sci-Fi: "Sapiens: A Brief History of Humankind" by Yuval Noah Harari.
     * Medical & Science: "Guyton and Hall Textbook of Medical Physiology".
   - Always give the author, 1-2 sentence compelling summary of why to read it, and suggest searching for it on BookLoop!

Tone and Style:
- Warm, encouraging, bookish, concise, and structured with bullet points.
- If relevant, include clickable markdown routes: [Marketplace](/books), [List a Book](/sell), [My Orders](/dashboard/orders), [Exchanges](/dashboard/exchanges), [Messages](/chat).`;

// Local fallback answers when Gemini API key is missing or external rate-limited
function getSmartFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('recommend') || q.includes('suggest') || q.includes('good book') || q.includes('read')) {
    return `Here are some top reader recommendations on BookLoop right now:

📚 **1. For Personal Growth & Daily Routines:**
• **"Atomic Habits" by James Clear** — The ultimate guide to breaking bad habits and building 1% improvements daily. Perfect for anyone wanting a fresh start.

💻 **2. For Software Engineers & Tech Students:**
• **"Clean Code" by Robert C. Martin** — An absolute classic on crafting readable, professional software architecture.
• **"JavaScript: The Definitive Guide" by David Flanagan** — The bible of web development, available at massive discounts from verified seniors!

🧠 **3. For Mindset & Thinking:**
• **"Sapiens: A Brief History of Humankind" by Yuval Noah Harari** — A mind-expanding journey through human evolution and civilization.

💰 **4. For Finance & Entrepreneurship:**
• **"Rich Dad Poor Dad" by Robert Kiyosaki** & **"Zero to One" by Peter Thiel**.

✨ You can search and grab any of these immediately on the [Marketplace](/books)! What genre do you enjoy most?`;
  }

  if (q.includes('sell') || q.includes('list') || q.includes('pricing') || q.includes('earn')) {
    return `Selling your books on BookLoop is quick and free! Here is a simple 3-step guide:

1. **Snap Clear Photos:** Take 2-3 well-lit photos showing the front cover, spine, and sample page condition.
2. **List Your Book in 2 Mins:** Go to [List a Book](/sell). Fill in title, author, condition (*Like New*, *Used - Good*, etc.), and asking price.
3. **Smart Pricing Tip:** Used books priced at **40% to 60% off original MRP** usually sell within 48 hours!
4. **Choose Handover Mode:** Opt for **Handshake Meetup** (e.g. nearby metro station or college gate) or **Courier Delivery**.

Once listed, interested buyers can message you in [Chat](/chat) or submit price offers at [Offers Received](/dashboard/offers)!`;
  }

  if (q.includes('buy') || q.includes('order') || q.includes('escrow') || q.includes('safe') || q.includes('otp') || q.includes('track')) {
    return `Buying on BookLoop is 100% safe with **BookLoop Escrow Protection**:

🛡️ **How Escrow & Handover Work:**
1. **Find Your Book:** Explore thousands of community listings on the [Marketplace](/books).
2. **Place Order / Offer:** Buy directly or negotiate price using the "Make Offer" feature.
3. **Escrow Security:** When you pay, funds are safely locked in BookLoop Escrow — the seller does **not** receive your money yet.
4. **Delivery Security OTP:** You receive a private 4-digit OTP. Meet the seller or courier, inspect the pages and spine.
5. **Release Payment:** Share your OTP only after you are 100% satisfied. Track status live anytime at [Orders & Purchases](/dashboard/orders)!`;
  }

  if (q.includes('exchange') || q.includes('swap')) {
    return `BookLoop makes swapping books with fellow readers seamless!

🔄 **How Book Swaps Work:**
1. Look for listings tagged with **"Buy + Exchange"** on the [Marketplace](/books).
2. Click **"Propose Swap"** on the book page or directly in [Chat](/chat).
3. Select which book from your shelf you'd like to trade and write a short note.
4. Coordinate meeting at a convenient campus spot or metro gate.
5. Track and manage all trade offers at [Exchange Requests](/dashboard/exchanges)!`;
  }

  return `Welcome to **BookLoop**! I'm **Loopie**, your personal AI guide and book companion 🤖🌸📚✨

Here is how I can guide you today:
• 📚 **Book Recommendations:** Tell me what genres or authors you love, and I'll find great matches.
• 💰 **Seller Guide:** How to list books on [Sell Page](/sell), take good photos, and price for fast sales.
• 🔄 **Book Swaps:** How to trade reads with fellow members with zero platform fees.
• 🛡️ **Buyer Guide & OTP:** Learn how to search, place offers, and verify books with **Escrow Protection & OTP**.
• 🚚 **Order Tracking:** How to check live milestones at [Orders & Purchases](/dashboard/orders).

What would you like to explore today?`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is available, call Gemini 3.8 Flash
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        // Map messages to Gemini format
        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        });

        const reply = response.text || '';
        if (reply.trim().length > 0) {
          return NextResponse.json({ reply });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, using intelligent assistant fallback:', geminiError);
      }
    }

    // Intelligent domain-aware fallback response
    const lastUserMsg = [...messages].reverse().find((m: { role: string; content: string }) => m.role === 'user');
    const fallbackText = getSmartFallbackResponse(lastUserMsg?.content || '');
    return NextResponse.json({ reply: fallbackText });

  } catch (error: any) {
    console.error('AI Assistant route error:', error);
    return NextResponse.json({
      reply: 'Hello! I am Loopie, your BookLoop AI Assistant. You can explore books on the Marketplace, list your books to sell in 2 minutes, or ask me for personalized book recommendations anytime!'
    });
  }
}
