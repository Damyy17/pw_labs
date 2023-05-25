from typing import Final
from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import Updater, Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackContext, CallbackQueryHandler
from quiz import fetch_quizzes, fetch_quiz, submit_answer, delete_user, login_user
import requests

TOKEN: Final = '6281309378:AAF_Ls5u1xCXe26zGuleW3UuZx00TSDW4ZI'
BOT_USERNAME: Final = '@faf201_Grosu_Damian_bot'
NEWS_API_TOKEN: Final = '6c0c1e9f66ae4ae087538010c681b19f'
TOKEN_QUIZ_API: Final = '91322a6aa8204445086c5d965750d05d9c05953f3c301c4d6e778be49f65b6f5'

#store for news
saved_urls = {}
user_mapping = {}


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
        "/quiz - Start a quiz"
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


#quiz
async def start(update: Update, context):
    user = update.message.from_user
    first_name = getattr(user, 'first_name', '')
    last_name = getattr(user, 'last_name', '')
    
    if first_name is None or first_name.strip() == '':
        first_name = 'Unknown'
    if last_name is None or last_name.strip() == '':
        last_name = 'Unknown'
    
    context.user_data['name'] = first_name
    context.user_data['surname'] = last_name
    
    user_id = login_user(first_name, last_name, TOKEN_QUIZ_API)
    context.user_data['user_id'] = user_id
    print(user_id)

    keyboard = []
    quizzes = fetch_quizzes(TOKEN_QUIZ_API)
    for quiz in quizzes:
        callback_data = f'quiz:{quiz["id"]}'
        keyboard.append([InlineKeyboardButton(quiz["title"], callback_data=callback_data)])

    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text('Please choose a quiz:', reply_markup=reply_markup)


async def button(update: Update, context: CallbackContext):
    query = update.callback_query

    # Check if it is a quiz selection or answer selection
    if query.data.startswith('quiz:'):
        quiz_id = query.data.split(':')[1]
        context.user_data['quiz_id'] = quiz_id

        quiz_data = fetch_quiz(quiz_id, TOKEN_QUIZ_API)
        if quiz_data:
            questions = quiz_data['questions']
            context.user_data['questions'] = questions
            await show_next_question(update, context)
        else:
            await query.edit_message_text(text='Failed to fetch quiz data.')
    elif query.data.startswith('answer:'):
        await handle_answer(update, context)




async def show_next_question(update: Update, context: CallbackContext):
    user_data = context.user_data
    questions = user_data.get('questions')
    current_question_index = user_data.get('current_question_index', 0)
    total_questions = len(questions)

    if current_question_index >= total_questions:
        await finish_quiz(update, context)
        return

    question = questions[current_question_index]
    question_text = question['question']
    answers = question['answers']
    message_text = f"{question_text}\n\nPlease select an option:"

    buttons = []
    for index, answer in enumerate(answers):
        buttons.append([InlineKeyboardButton(answer, callback_data=f'answer:{index}')])

    reply_markup = InlineKeyboardMarkup(buttons)
    await update.callback_query.edit_message_text(text=message_text, reply_markup=reply_markup)
    user_data['current_question'] = question
    user_data['expected_answer'] = answers




async def handle_answer(update: Update, context: CallbackContext):
    query = update.callback_query
    selected_option = int(query.data.split(':')[1])

    expected_answer = context.user_data.get('expected_answer')
    current_question_index = context.user_data.get('current_question_index', 0)

    if expected_answer and 1 <= selected_option <= len(expected_answer):
        selected_answer = expected_answer[selected_option - 1]
        question = context.user_data['current_question']
        question_id = question['id']
        quiz_id = context.user_data['quiz_id']
        user_id = context.user_data.get('user_id')

        result = submit_answer(quiz_id, user_id, question_id, selected_answer, TOKEN_QUIZ_API)
        if result:
            is_correct = result.get('correct', False)
            if is_correct:
                context.user_data['score'] = context.user_data.get('score', 0) + 1
            await query.edit_message_text(text='Your answer is submitted!')
        else:
            await query.edit_message_text(text='Failed to submit your answer.')

    context.user_data['current_question_index'] = current_question_index + 1
    await show_next_question(update, context)



async def finish_quiz(update: Update, context):
    user_data = context.user_data
    score = user_data.get('score', 0)
    total_questions = len(user_data.get('questions', []))

    delete_user(user_data['user_id'], TOKEN_QUIZ_API)
    user_data.clear()

    message_text = f"Quiz finished!\n\nYour score: {score}/{total_questions}"
    await update.callback_query.message.reply_text(message_text)


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
        if 'quiz' in text:
            await handle_answer(update, context)  # Handle quiz answer
            return
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

    app.add_handler(CommandHandler("quiz", start))
    app.add_handler(CallbackQueryHandler(button, pattern='^quiz:'))
    app.add_handler(CallbackQueryHandler(handle_answer, pattern='^answer:'))



    #Messages
    app.add_handler(MessageHandler(filters.TEXT, handle_message))

    #Erros
    app.add_error_handler(error)

    print('Polling...')
    app.run_polling(poll_interval=3) 