# Magic Wand Feature - Quick Setup Guide

## What You Need

1. **OpenAI API Key** (free or paid account)
2. **5 minutes** to follow these steps
3. **Computer** with Node.js installed

## Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. ⚠️ **Keep it safe - don't share it!**

## Step 2: Add API Key to Project

Create a file named `.env.local` in the project root:

```bash
# In the rep-copilot directory
touch .env.local
```

Add this line to `.env.local`:
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Replace `sk-your-actual-api-key-here` with your actual key from Step 1.

## Step 3: Test the Feature

Start the development server:
```bash
npm run dev
```

Open your browser to http://localhost:3000

Try these test cases:

### Test 1: Basic Enhancement
1. Type in the input field: `show me sales`
2. Click the **Magic Wand button** (sparkles icon in gold)
3. Watch it transform to something like:
   > "Show me this quarter's sales performance by region, including top 5 prescribed products and monthly trends in prescription volumes for my territory"

### Test 2: CRM Enhancement
1. Clear the input field
2. Type: `who should I visit`
3. Click the Magic Wand button
4. Watch it enhance with prioritization criteria

### Test 3: Compliance Enhancement
1. Clear the input field
2. Type: `meal spend limits`
3. Click the Magic Wand button
4. Watch it add HCP context and documentation requirements

## Troubleshooting

### Issue: "Failed to enhance prompt" error

**Solution:**
1. Check your `.env.local` file has the correct `OPENAI_API_KEY`
2. Make sure the API key is valid (not expired)
3. Check you have internet connection
4. Check OpenAI status: https://status.openai.com

### Issue: Magic Wand button doesn't respond

**Solution:**
1. Make sure you typed something in the input field (button is disabled when empty)
2. Check browser console (F12) for error messages
3. Verify the dev server is running (`npm run dev`)

### Issue: Enhancement is slow

**Solution:**
1. This is normal - first call may take 1-2 seconds
2. Subsequent calls are faster (connection is established)
3. Consider using paid OpenAI account for faster response

## Cost Information

**Good news:** This feature uses GPT-4o-mini, which is very cost-effective!

**Estimated costs:**
- Free tier: $5 in free credits (enough for ~33,000 enhancements)
- Paid tier: ~$0.00015 per enhancement
- Example: 100 enhancements = ~1.5 cents

**For the workshop demo:**
- Expect <10 enhancements
- Total cost: <1 cent
- Well within free tier limits

## Tips for the Workshop

### Do:
✅ Have a few test prompts ready
✅ Show the streaming effect (it looks cool!)
✅ Explain it's AI-powered prompt enhancement
✅ Mention it's specialized for AstraZeneca context

### Don't:
❌ Don't share your API key
❌ Don't worry about costs (it's cheap)
❌ Don't stress if it's slow (first call is always slower)

### Demo Script

Here's a simple script for your demo:

1. **Start with a basic prompt:**
   > "Type something simple like 'show me sales'"

2. **Click the Magic Wand:**
   > "Now click the Magic Wand button (the sparkles icon)"

3. **Watch the enhancement:**
   > "See how it's adding context - territory, time period, specific metrics?"

4. **Explain the value:**
   > "This helps reps get better results without typing long, detailed prompts"

5. **Show another example:**
   > "Let's try another one - 'who should I visit'"

6. **Wrap up:**
   > "The Magic Wand uses AI to make prompts more specific and effective"

## Files You Can Ignore

You'll see some new files in the project:
- `.env.example` - Template for environment variables (you can ignore)
- `docs/MAGIC_WAND_FEATURE.md` - Detailed documentation (for reference)
- `docs/IMPLEMENTATION_SUMMARY.md` - Technical details (for reference)

**You only need to focus on:**
- Creating `.env.local` with your API key
- Testing the feature in the browser

## Need Help?

If you run into issues:

1. **Check the console:** Press F12 in browser, look for red errors
2. **Check the terminal:** Look for error messages in `npm run dev`
3. **Check the API key:** Make sure it's correct in `.env.local`
4. **Restart the server:** Stop `npm run dev` and start again

## Success Checklist

Before your workshop, make sure you can:

- [ ] Start the dev server with `npm run dev`
- [ ] Open http://localhost:3000 in browser
- [ ] Type "show me sales" in input field
- [ ] Click Magic Wand button
- [ ] See the prompt enhance in real-time
- [ ] Understand how to explain it to others

**Estimated time to complete:** 5 minutes

---

**Good luck with your workshop! 🚀**

Questions? Check the detailed docs:
- `/docs/MAGIC_WAND_FEATURE.md` - Full documentation
- `/docs/IMPLEMENTATION_SUMMARY.md` - Technical details

Last updated: January 13, 2026
