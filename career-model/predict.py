from flask import Flask, request, jsonify
import pandas as pd
import joblib
from pydantic import BaseModel, Field
from pydantic.tools import parse_obj_as
from flask_cors import CORS
import os 
app = Flask(__name__)
CORS(app)

# Pydantic Models
class Student(BaseModel):
    student_id: str = Field(alias="Student ID")
    gender: str = Field(alias="Gender")
    age: str = Field(alias="Age")
    major: str = Field(alias="Major")
    gpa: str = Field(alias="GPA")
    extra_curricular: str = Field(alias="Extra Curricular")
    num_programming_languages: str = Field(alias="Num Programming Languages")
    num_past_internships: str = Field(alias="Num Past Internships")

    class Config:
        allow_population_by_field_name = True

class PredictionResult(BaseModel):
    good_employee: int


# Main Functionality
def predict(student):
    '''
    Returns a prediction on whether the student will be a good employee
    based on given parameters by using the ML model

    Parameters
    ----------
    student : dict
        A dictionary that contains all fields in Student
    
    Returns
    -------
    dict
        A dictionary satisfying type PredictionResult, contains a single field
        'good_employee' which is either 1 (will be a good employee) or 0 (will
        not be a good employee)
    '''
    # Use Pydantic to validate model fields exist
    print(student)
    student = parse_obj_as(Student, student)

    clf = joblib.load('model.pkl')
    
    student = student.dict(by_alias=True)
    query = pd.DataFrame(student, index=[0])
    prediction = clf.predict(query) # TODO: Error handling ??
    return { 'good_employee': prediction[0] }

@app.route('/predict', methods=['POST'])
def make_prediction():
    # print("Method:", request.method)
    # print("Headers:", request.headers)
    # print("JSON Data:", request.json)  # This should print the JSON body if available
    # print("Raw Data:", request.data)

    import json

    raw_data = request.data.decode('utf-8')  # Decode bytes to string
    
    try:
        json_data = json.loads(raw_data)  # Parse JSON string to dict
        print("Parsed JSON:", json_data)
    except json.JSONDecodeError:
        print("Received data is not valid JSON.")
    if not request.json:
        print("No JSON data received.")
        
        return jsonify({"error": "No data received"}), 400
  
    student = parse_obj_as(Student, json_data)

    # Make prediction
    prediction = predict(student)

    # Convert numpy.int64 to Python int before serialization
    prediction['good_employee'] = int(prediction['good_employee'])

    # Return result
    return jsonify(prediction)

@app.route('/predict', methods=['GET'])
def get_prediction():
    # Return result
    return make_prediction()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))