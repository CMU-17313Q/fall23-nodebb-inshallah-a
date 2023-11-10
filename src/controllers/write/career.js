'use strict';

const helpers = require('../helpers');
const user = require('../../user');
const db = require('../../database');

const Career = module.exports;
Career.register = async function (req, res) {
    const userData = req.query;
    try {
        // Forward the request to the Flask application
        // console.log(userData.student_id);
        const flaskResponse = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include any other necessary headers
            },
            body: JSON.stringify({
                student_id: userData.student_id,
                major: userData.major,
                age: userData.age,
                gender: userData.gender,
                gpa: userData.gpa,
                extra_curricular: userData.extra_curricular,
                num_programming_languages: userData.num_programming_languages,
                num_past_internships: userData.num_past_internships,
            }),
        });

        const userCareerData = {
            student_id: userData.student_id,
            major: userData.major,
            age: userData.age,
            gender: userData.gender,
            gpa: userData.gpa,
            extra_curricular: userData.extra_curricular,
            num_programming_languages: userData.num_programming_languages,
            num_past_internships: userData.num_past_internships,
        };
        if (!flaskResponse.ok) {
            throw new Error('Failed to get prediction from Flask app.');
        }
        const predictionResult = await flaskResponse.json();
        console.log(predictionResult);
        userCareerData.prediction = predictionResult.good_employee;
        await user.setCareerData(req.uid, userCareerData);
        db.sortedSetAdd('users:career', req.uid, req.uid);
        res.json({});
    } catch (err) {
        console.log(err);
        helpers.noScriptErrors(req, res, err.message, 400);
    }
};
