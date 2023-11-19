# app.py
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/topics', methods=['GET'])
def get_topics():
    topics = [
        {
            "name": "Mathematics",
            "questions": [
                {"id": 1, "text": "What is 2+2?", "options": ["2", "3", "4", "5"], "correctAnswer": "4"},
                {"id": 3, "text": "What is 3+3?", "options": ["5", "6", "4", "2"], "correctAnswer": "6"},
                # ... more questions
            ],
        },
        {
            "name": "Polity",
            "questions": [
                {"id": 1, "text": "Which Act for the first time recognized the political and administrative functions of the East India Company?", "options": ["Regulating Act of 1773", "Pitt's India Act of 1784", "Charter Act of 1833", "Government of India Act of 1858"], "correctAnswer": "Regulating Act of 1773"},
                {"id": 2, "text": "Who was appointed as the first Governor-General of India as per the Charter Act of 1833?", "options": ["Lord William Bentick", "Lord Warren Hastings", "Lord Dalhousie", "Lord Canning"], "correctAnswer": "Lord William Bentick"},
                {"id": 3, "text": "The Government of India Act of 1919 is also known by which name?", "options": ["Montagu-Chelmsford Reforms", "Morley-Minto Reforms", "Pitt's India Act", "Mountbatten Plan"], "correctAnswer": "Montagu-Chelmsford Reforms"},
                {"id": 4, "text": "Which Act introduced the system of communal representation for Muslims by accepting the concept of ‘separate electorate’?", "options": ["Indian Councils Act of 1909", "Government of India Act of 1919", "Charter Act of 1853", "Indian Independence Act of 1947"], "correctAnswer": "Indian Councils Act of 1909"},
                {"id": 5, "text": "Who became the first Indian to join the Viceroy’s Executive Council as per the Indian Councils Act of 1909?", "options": ["Satyendra Prasad Sinha", "Dadabhai Naoroji", "C. Rajagopalachari", "Rabindranath Tagore"], "correctAnswer": "Satyendra Prasad Sinha"},
                {"id": 6, "text": "Who was the first Governor-General of Bengal?", "options": ["Lord Canning", "Lord Dalhousie", "Lord Warren Hastings", "Lord William Bentick"], "correctAnswer": "Lord Warren Hastings"},
                {"id": 7, "text": "Which Act marked the end of the Company’s trade activities?", "options": ["Charter Act of 1833", "Pitt's India Act of 1784", "Regulating Act of 1773", "Government of India Act of 1858"], "correctAnswer": "Charter Act of 1833"},
                {"id": 8, "text": "In which year was the Supreme Court established at Calcutta?", "options": ["1773", "1781", "1774", "1858"], "correctAnswer": "1774"},
                {"id": 9, "text": "What was the main feature of Pitt’s India Act of 1784?", "options": ["Establishment of Supreme Court", "Separation of commercial and political functions of the Company", "Introduction of Diarchy", "Appointment of first Indian to Viceroy’s Executive Council"], "correctAnswer": "Separation of commercial and political functions of the Company"},
                {"id": 10, "text": "Which Act introduced the concept of portfolio system?", "options": ["Indian Councils Act of 1909", "Charter Act of 1853", "Government of India Act of 1919", "Indian Councils Act of 1861"], "correctAnswer": "Indian Councils Act of 1861"},
                {"id": 11, "text": "Which Act led to the establishment of a separate Governor-General’s legislative council?", "options": ["Charter Act of 1853", "Government of India Act of 1919", "Indian Independence Act of 1947", "Government of India Act of 1935"], "correctAnswer": "Charter Act of 1853"},
                {"id": 12, "text": "Who became the first Viceroy of India?", "options": ["Lord Canning", "Lord Mountbatten", "Lord Dalhousie", "Lord William Bentick"], "correctAnswer": "Lord Canning"},
                {"id": 13, "text": "The Indian Councils Act of 1909 is commonly known as?", "options": ["Montagu-Chelmsford Reforms", "Morley-Minto Reforms", "Simon Commission Report", "Rowlatt Act"], "correctAnswer": "Morley-Minto Reforms"},
                {"id": 14, "text": "Which Act introduced dyarchy in provinces?", "options": ["Government of India Act of 1935", "Government of India Act of 1919", "Indian Councils Act of 1909", "Pitt’s India Act of 1784"], "correctAnswer": "Government of India Act of 1919"},
                {"id": 15, "text": "In which year was the Central Public Service Commission established?", "options": ["1926", "1935", "1947", "1919"], "correctAnswer": "1926"},
                {"id": 16, "text": "Which Act provided for the establishment of the Reserve Bank of India?", "options": ["Government of India Act of 1935", "Indian Independence Act of 1947", "Government of India Act of 1919", "Pitt’s India Act of 1784"], "correctAnswer": "Government of India Act of 1935"},
                {"id": 17, "text": "Who was the first Indian to become a member of the Viceroy's Executive Council?", "options": ["C. Rajagopalachari", "Rabindranath Tagore", "Satyendra Prasad Sinha", "Dadabhai Naoroji"], "correctAnswer": "Satyendra Prasad Sinha"},
                {"id": 18, "text": "The Morley-Minto Reforms of 1909 primarily focused on what aspect of Indian governance?", "options": ["Judicial Reforms", "Educational Reforms", "Constitutional Reforms", "Police Reforms"], "correctAnswer": "Constitutional Reforms"},
                {"id": 19, "text": "Which act is known for introducing the first step towards representative government in India?", "options": ["Indian Councils Act of 1892", "Government of India Act of 1919", "Indian Councils Act of 1909", "Government of India Act of 1935"], "correctAnswer": "Indian Councils Act of 1892"},
                {"id": 20, "text": "Who was responsible for the partition of Bengal in 1905?", "options": ["Lord Curzon", "Lord Minto", "Lord Hardinge", "Lord Chelmsford"], "correctAnswer": "Lord Curzon"}
            ],
        }
        # ... more topics
    ]
    response = jsonify(topics)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(debug=True)
