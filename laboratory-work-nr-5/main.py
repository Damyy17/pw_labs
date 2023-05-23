from typing import Final
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import requests

TOKEN: Final = '6281309378:AAF_Ls5u1xCXe26zGuleW3UuZx00TSDW4ZI'
BOT_USERNAME: Final = '@faf201_Grosu_Damian_bot'
NEWS_API_TOKEN: Final = '6c0c1e9f66ae4ae087538010c681b19f'

#store for news
saved_urls = {}


#Commands 
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('Hello! Thanks for chatting with me! I am News Bot!')


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    command_list = [
        "/start - Start the bot",
        "/help - Show available commands",
        "/cowsay [text] - Make a cow say something",
        "/latest_news [topic] - Show the latest news",
        "/save_news [url] - Save a news article",
        "/show_saved_news - Show saved news",
         "/tell_joke - Tell a random joke",
    ]
    help_text = "Hey I'm here to help you.\n" + " These are available commands that you can use:\n\n" + "\n".join(command_list)
    await update.message.reply_text(help_text)


async def cowsay_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text_parts = update.message.text.split(' ', 1) 
    text = text_parts[1] if len(text_parts) > 1 else '' 

    cow_speech = r'''
 _________________________
< {} >
 -------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
    '''.format(text)

    await update.message.reply_text(cow_speech)


async def latest_news_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    topic = context.args[0] if context.args else 'general'
    url = f'https://newsapi.org/v2/everything?q={topic}&apiKey={NEWS_API_TOKEN}&pageSize=5'
    response = requests.get(url)
    news_data = response.json()
    print(response.status_code)

    if response.status_code == 200 and news_data['status'] == 'ok':
        articles = news_data['articles']
        if articles:
            news_list = '\n'.join([f"- {article['title']}\n{article['description']}\n{article['url']}\n" for article in articles])
            await update.message.reply_text(f"Here are the latest {topic.capitalize()} news articles:\n\n{news_list}")
        else:
            await update.message.reply_text(f"No news articles found for the topic '{topic}'.")
    else:
        await update.message.reply_text('Sorry, I could not retrieve the latest news at the moment.')


async def save_news_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.message.chat.id
    url = context.args[0] if context.args else ''

    if chat_id not in saved_urls:
        saved_urls[chat_id] = []

    if url:
        saved_urls[chat_id].append(url)
        await update.message.reply_text('News saved successfully!')
    else:
        await update.message.reply_text('Please provide a valid URL.')


async def show_saved_news_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.message.chat.id

    if chat_id in saved_urls and saved_urls[chat_id]:
        news_list = saved_urls[chat_id]
        formatted_list = "\n".join([f"{index+1}. {news}" for index, news in enumerate(news_list)])
        message = f"Here are your saved News:\n\n{formatted_list}"
        await update.message.reply_text(message)
    else:
        await update.message.reply_text("No News have been saved.")


async def tell_joke(update: Update, context: ContextTypes.DEFAULT_TYPE):
    url = f'https://official-joke-api.appspot.com/random_joke'
    response = requests.get(url)
    joke_data = response.json()

    if 'setup' in joke_data and 'punchline' in joke_data:
        setup = joke_data['setup']
        punchline = joke_data['punchline']
        joke_text = f"{setup}\n\n{punchline}"
        await update.message.reply_text(joke_text)
    else:
        await update.message.reply_text("No jokes today!")


#Responses
def handle_response(text: str) -> str:
    proccesed_text: str = text.lower()

    if 'hey' in proccesed_text:
        return 'Hey there!'
    
    if 'how are you' in proccesed_text:
        return 'I am good!'
    
    if 'hahaha' in proccesed_text:
        return 'I am glad u liked the joke!'
    
    return 'Sorry, cant help :('



async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message_type: str = update.message.chat.type
    text: str = update.message.text

    print(f'User ({update.message.chat.id}) in {message_type}: "{text}"')

    if message_type == 'group':
        if BOT_USERNAME in text:
            new_text: str = text.replace(BOT_USERNAME, '').strip()
            response: str = handle_response(new_text)
        else:
            return
    else:
        response: str = handle_response(text)


    print('Bot', response)
    await update.message.reply_text(response)



async def error(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f'Update {update} caused error {context.error}')



if __name__ == '__main__':
    print('Starting bot...')
    app = Application.builder().token(TOKEN).build()

    #Commands
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(CommandHandler('help', help_command))
    app.add_handler(CommandHandler('cowsay', cowsay_command))
    app.add_handler(CommandHandler('latest_news', latest_news_command))
    app.add_handler(CommandHandler('save_news', save_news_command))
    app.add_handler(CommandHandler('saved_news', show_saved_news_command))
    app.add_handler(CommandHandler('tell_joke', tell_joke))

    #Messages
    app.add_handler(MessageHandler(filters.TEXT, handle_message))

    #Erros
    app.add_error_handler(error)

    print('Polling...')
    app.run_polling(poll_interval=3)