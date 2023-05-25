import requests

API_URL = 'https://late-glitter-4431.fly.dev/api/v54'

def fetch_quizzes(token):
    headers = {'X-Access-Token': token}
    response = requests.get(f'{API_URL}/quizzes', headers=headers)
    print(response.status_code)
    if response.status_code == 200:
        quizzes = response.json()
        return quizzes
    else:
        print('Failed to fetch quizzes.')
        return []


def fetch_quiz(quiz_id, token):
    headers = {'X-Access-Token': token}
    response = requests.get(f'{API_URL}/quizzes/{quiz_id}', headers=headers)
    if response.status_code == 200:
        quiz_data = response.json()
        return quiz_data
    else:
        print(f'Failed to fetch quiz with ID {quiz_id}.')
        return None


def login_user(name, surname, token):
    headers = {'X-Access-Token': token}
    payload = {
        'data': {
            'name': name,
            'surname': surname
        }
    }
    
    response = requests.post(f'{API_URL}/users', json=payload, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        user_id = data['id']
        return user_id
    else:
        print('Error logging in user:', response.text)
        return None


def submit_answer(quiz_id, user_id, question_id, answer, token):
    headers = {'X-Access-Token': token}
    payload = {
        'data':{
            'user_id': user_id,
            'question_id': question_id,
            'answer': answer
        }
    }
    
    response = requests.post(f'{API_URL}/quizzes/{quiz_id}/submit', json=payload, headers=headers)
    
    if response.status_code == 201:
        result = response.json()
        return result
    else:
        print('Error submitting answer:', response.text)
        return None


def delete_user(user_id, token):
    headers = {'X-Access-Token': token}
    response = requests.delete(f'{API_URL}/users/{user_id}', headers=headers)
    
    if response.status_code == 200:
        print(f'Deleted user with ID {user_id}.')
    else:
        print('Error deleting user:', response.text)