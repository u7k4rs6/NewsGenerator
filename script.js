// Symptom Button Selection
document.querySelectorAll('.symptom-button').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

// Medical History Button Selection
document.querySelectorAll('.medical-history-button').forEach(button => {
    button.addEventListener('click', function() {
        // If "None" is selected, deselect all other options
        if (this.dataset.history === 'None') {
            document.querySelectorAll('.medical-history-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
        } else {
            // Deselect "None" if another option is selected
            const noneButton = document.querySelector('.medical-history-button[data-history="None"]');
            noneButton.classList.remove('selected');
            this.classList.toggle('selected');
        }
    });
});

const API_KEY = 'AIzaSyDAzZPZ3-JmLCuJmC0QQG2ouIx0vQTsIlI';

document.getElementById('symptomForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get input values
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const selectedSymptoms = Array.from(document.querySelectorAll('.symptom-button.selected'))
        .map(button => button.dataset.symptom);
    const medicalHistory = Array.from(document.querySelectorAll('.medical-history-button.selected'))
        .map(button => button.dataset.history);
    const additionalInfo = document.getElementById('additionalInfo').value;
    
    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }

    // Show loading state
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const resultContent = document.getElementById('resultContent');
    
    loadingDiv.style.display = 'block';
    resultsDiv.style.display = 'none';
    
    // Construct prompt for Gemini
    const prompt = `
        Medical Analysis Request:

        Patient Information:
        - Age: ${age}
        - Gender: ${gender}
        - Reported Symptoms: ${selectedSymptoms.join(', ')}
        - Medical History: ${medicalHistory.length > 0 ? medicalHistory.join(', ') : 'None reported'}
        - Additional Information: ${additionalInfo || 'No additional details provided'}

        Please provide a detailed medical analysis with the following structure:

        1. Recommended Actions:
           - Home care recommendations
           - Lifestyle modifications

        2. Important Guidelines:
           DO's:
           - Specific actions to manage symptoms
           - Preventive measures
           - Monitoring recommendations

           DON'Ts:
           - Activities to avoid
           - Dietary restrictions
           - Risk factors to minimize

        3. Red Flags:
           - Warning signs requiring immediate medical attention
           - Emergency symptoms to watch for


        Please provide specific, actionable advice while maintaining appropriate medical disclaimers.
        And also give the results in a styled html format.
    `;

    try {
        // Call Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        const analysis = data.candidates[0].content.parts[0].text;

        // Hide loading, show results
        loadingDiv.style.display = 'none';
        resultContent.innerHTML = `
            <div>${analysis}</div>
        `;
        resultsDiv.style.display = 'block';

    } catch (error) {
        loadingDiv.style.display = 'none';
        resultContent.innerHTML = `
            <p style="color: red;">Error: ${error.message}</p>
            <p>Please try again later or contact support if the problem persists.</p>
        `;
        resultsDiv.style.display = 'block';
    }
});