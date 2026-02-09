document.addEventListener('DOMContentLoaded', function() {
// Initialize Three.js
let scene, camera, renderer, particles;
let particleSystem;

function initThree() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('three-container').appendChild(renderer.domElement);
    
    // Create particles
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--primary').trim());
    const color2 = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim());
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Positions
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
        
        // Colors - interpolate between two colors
        const mixedColor = color1.clone().lerp(color2, Math.random());
        colors[i] = mixedColor.r;
        colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    if (particleSystem) {
        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Initialize Three.js
initThree();
// #######################################################################################
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const resultDiv = document.getElementById('result');
const strengthBar = document.getElementById('strengthBar');
const strengthPercent = document.getElementById('strengthPercent');
const strengthText = document.getElementById('strengthText');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const exportBtn = document.getElementById('exportBtn');
const toggleDesc = document.getElementById('toggleDesc');
const stateDesc = document.getElementById('stateDesc');
const themeToggle = document.getElementById('themeToggle');
const generatedPasswordsDiv = document.getElementById('generatedPasswords');
const reportModal = document.getElementById('reportModal');
const reportBody = document.getElementById('reportBody');
const reportDate = document.getElementById('reportDate');
const closeReport = document.getElementById('closeReport');
const downloadReport = document.getElementById('downloadReport');
const passwordLengthSlider = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const currentInput = document.getElementById('currentInput');
const transitionTable = document.getElementById('transitionTable');
const dfaPath = document.getElementById('dfaPath');

// Requirement elements
const lengthReq = document.getElementById('lengthReq');
const uppercaseReq = document.getElementById('uppercaseReq');
const digitReq = document.getElementById('digitReq');
const specialReq = document.getElementById('specialReq');

// DFA State elements
const stateQ0 = document.getElementById('stateQ0');
const stateQ1 = document.getElementById('stateQ1');
const stateQ2 = document.getElementById('stateQ2');
const stateQ3 = document.getElementById('stateQ3');
const stateQ4 = document.getElementById('stateQ4');
const trans0 = document.getElementById('trans0');
const trans1 = document.getElementById('trans1');
const trans2 = document.getElementById('trans2');
const trans3 = document.getElementById('trans3');
const currentStateDiv = document.getElementById('currentState');

// DFA state tracking
let currentState = 'q0';
let isDescriptionCollapsed = false;
let isDarkMode = true;
let generatedPasswords = [];
let currentReportData = null;

// Update transition lines position
function updateTransitionLines() {
    const states = document.querySelectorAll('.state');
    if (states.length === 5) {
        const containerWidth = document.querySelector('.states-container').offsetWidth;
        const stateWidth = 60; // Default state width 60px
        const gap = (containerWidth - (stateWidth * 5)) / 4;//state ka beech ma spacfe calculate karaha ha
        
        // Update transition line positions
        for (let i = 0; i < 4; i++) {
            const line = document.getElementById(`trans${i}`);
            if (line) {
                const left = stateWidth + (stateWidth + gap) * i;  //start left sa hoga
                const width = gap;
                line.style.left = `${left}px`;
                line.style.width = `${width}px`;
            }
        }
    }
}

// Call on load and resize
window.addEventListener('load', updateTransitionLines);
window.addEventListener('resize', updateTransitionLines);

// Theme toggle functionality
themeToggle.addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i> Light Mode' : 
        '<i class="fas fa-moon"></i> Dark Mode';
});

//  theme toggle ha ye light mode to dark mode to UI kia hoga .
togglePassword.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

// Toggle state description
toggleDesc.addEventListener('click', function() {
    isDescriptionCollapsed = !isDescriptionCollapsed;
    stateDesc.classList.toggle('collapsed', isDescriptionCollapsed);
    toggleDesc.querySelector('i').className = isDescriptionCollapsed ? 
        'fas fa-chevron-down' : 'fas fa-chevron-up';
});

// Copy password to clipboard
copyBtn.addEventListener('click', function() {
    if (passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Password';
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    }
});

// Password length slider
passwordLengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
});

// Generate password
generateBtn.addEventListener('click', function() {
    const length = parseInt(passwordLengthSlider.value);
    const includeUppercase = document.getElementById('genUppercase').checked;
    const includeLowercase = document.getElementById('genLowercase').checked;
    const includeNumbers = document.getElementById('genNumbers').checked;
    const includeSymbols = document.getElementById('genSymbols').checked;
    
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        alert('Please select at least one character type!');
        return;
    }
    
    const password = generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
    passwordInput.value = password;
    validatePassword(password);
    
    // Add to generated passwords list
    generatedPasswords.unshift(password);
    if (generatedPasswords.length > 5) {
        generatedPasswords.pop();
    }
    updateGeneratedPasswordsList();
});

function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    // Ensure all required character types are included
    if (includeUppercase && !/[A-Z]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * length);
        password = password.substring(0, randomIndex) + 
                   'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26)) + 
                   password.substring(randomIndex + 1);
    }
    
    if (includeLowercase && !/[a-z]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * length);
        password = password.substring(0, randomIndex) + 
                   'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26)) + 
                   password.substring(randomIndex + 1);
    }
    
    if (includeNumbers && !/[0-9]/.test(password)) {
        const randomIndex = Math.floor(Math.random() * length);
        password = password.substring(0, randomIndex) + 
                   '0123456789'.charAt(Math.floor(Math.random() * 10)) + 
                   password.substring(randomIndex + 1);
    }
    
    if (includeSymbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const randomIndex = Math.floor(Math.random() * length);
        password = password.substring(0, randomIndex) + 
                   symbols.charAt(Math.floor(Math.random() * symbols.length)) + 
                   password.substring(randomIndex + 1);
    }
    
    return password;
}

function updateGeneratedPasswordsList() {
    generatedPasswordsDiv.innerHTML = '';
    generatedPasswords.forEach((password, index) => {
        const passwordDiv = document.createElement('div');
        passwordDiv.className = 'generated-password';
        passwordDiv.innerHTML = `
            <span>${password}</span>
            <button class="copy-generated" data-password="${password}"><i class="fas fa-copy"></i></button>
        `;
        generatedPasswordsDiv.appendChild(passwordDiv);
    });
    
    // Add event listeners to copy buttons
    document.querySelectorAll('.copy-generated').forEach(button => {
        button.addEventListener('click', function() {
            const password = this.getAttribute('data-password');
            navigator.clipboard.writeText(password).then(() => {
                const icon = this.querySelector('i');
                icon.className = 'fas fa-check';
                setTimeout(() => {
                    icon.className = 'fas fa-copy';
                }, 2000);
            });
        });
    });
}

// Export report
exportBtn.addEventListener('click', function() {
    if (!passwordInput.value) {
        alert('Please enter or generate a password first!');
        return;
    }
    
    currentReportData = generateReportData();
    displayReport(currentReportData);
    reportModal.style.display = 'flex';
});

closeReport.addEventListener('click', function() {
    reportModal.style.display = 'none';
});

// Download report as PDF
downloadReport.addEventListener('click', function() {
    if (!currentReportData) return;
    
    // Create a temporary div for PDF generation
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-report';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.width = '800px';
    pdfContainer.style.padding = '30px';
    pdfContainer.style.fontFamily = 'Poppins, sans-serif';
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.color = '#2c3e50';
    
    // Clone the exact dynamic transition table for the report
    const transitionTableClone = transitionTable.cloneNode(true);
    transitionTableClone.style.width = '100%';
    transitionTableClone.style.borderCollapse = 'collapse';
    transitionTableClone.style.marginTop = '10px';
    transitionTableClone.style.fontSize = '12px';
    
    // Style the cloned table for PDF
    const ths = transitionTableClone.querySelectorAll('th');
    const tds = transitionTableClone.querySelectorAll('td');
    const trs = transitionTableClone.querySelectorAll('tr');
    
    ths.forEach(th => {
        th.style.padding = '6px';
        th.style.textAlign = 'center';
        th.style.border = '1px solid #ddd';
        th.style.backgroundColor = '#e9ecef';
        th.style.color = '#2c3e50';
        th.style.fontWeight = '600';
    });
    
    tds.forEach(td => {
        td.style.padding = '6px';
        td.style.textAlign = 'center';
        td.style.border = '1px solid #ddd';
        if (td.classList.contains('state-cell')) {
            td.style.fontWeight = 'bold';
            td.style.color = '#6a11cb';
        }
        if (td.classList.contains('highlight')) {
            td.style.backgroundColor = '#6a11cb';
            td.style.color = 'white';
            td.style.fontWeight = 'bold';
            td.style.border = '2px solid #6a11cb';
        }
    });
    
    trs.forEach((tr, index) => {
        if (index > 0) {
            tr.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
        }
    });
    
    // Generate PDF content
    const pdfContent = generatePDFContent(currentReportData, transitionTableClone.outerHTML);
    pdfContainer.innerHTML = pdfContent;
    document.body.appendChild(pdfContainer);
    
    // Generate PDF
    html2canvas(pdfContainer).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`password_validation_report_${new Date().getTime()}.pdf`);
        document.body.removeChild(pdfContainer);
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        document.body.removeChild(pdfContainer);
    });
});

// Validate password on input
passwordInput.addEventListener('input', function() {
    validatePassword(passwordInput.value);
});

// Focus on input when clicking on container
document.querySelector('.container').addEventListener('click', function(e) {
    if (e.target === this) {
        passwordInput.focus();
    }
});

function validatePassword(password) {
    // Reset all states
    resetStates();
    
    // DFA states
    let hasUppercase = /[A-Z]/.test(password);
    let hasDigit = /[0-9]/.test(password);
    let hasSpecial = /[^A-Za-z0-9]/.test(password);
    let hasMinLength = password.length >= 8;
    
    // Update requirement indicators
    updateRequirement(lengthReq, hasMinLength);
    updateRequirement(uppercaseReq, hasUppercase);
    updateRequirement(digitReq, hasDigit);
    updateRequirement(specialReq, hasSpecial);
    
    // Calculate strength
    let strength = 0;
    if (hasMinLength) strength += 25;
    if (hasUppercase) strength += 25;
    if (hasDigit) strength += 25;
    if (hasSpecial) strength += 25;
    
    // Update strength bar
    updateStrengthBar(strength);
    
    // Update DFA visualization based on current state
    updateDFAState(hasMinLength, hasUppercase, hasDigit, hasSpecial);
    
    // Update current input display
    if (password) {
        currentInput.innerHTML = '';
        for (let i = 0; i < password.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.className = 'input-character';
            charSpan.textContent = password[i];
            currentInput.appendChild(charSpan);
        }
    } else {
        currentInput.textContent = '-';
    }
    
    // Update dynamic transition table
    updateDynamicTransitionTable(password, hasMinLength, hasUppercase, hasDigit, hasSpecial);
    
    // Update DFA processing path
    updateDFAPath(password, hasMinLength, hasUppercase, hasDigit, hasSpecial);
    
    // Final DFA acceptance check
    if (hasMinLength && hasUppercase && hasDigit && hasSpecial) {
        showResult('ACCEPT', 'accept');
        createConfetti();
    } else {
        showResult('REJECT', 'reject');
    }
}

function resetStates() {
    // Reset all state visuals
    stateQ0.classList.remove('active');
    stateQ1.classList.remove('active');
    stateQ2.classList.remove('active');
    stateQ3.classList.remove('active');
    stateQ4.classList.remove('active');
    
    trans0.classList.remove('active');
    trans1.classList.remove('active');
    trans2.classList.remove('active');
    trans3.classList.remove('active');
    
    // Set initial state
    stateQ0.classList.add('active');
    currentState = 'q0';
    currentStateDiv.innerHTML = '<i class="fas fa-map-marker-alt"></i> Current State: q0 (Start)';
}

function updateDFAState(hasMinLength, hasUppercase, hasDigit, hasSpecial) {
    resetStates();
    
    if (hasMinLength) {
        stateQ1.classList.add('active');
        trans0.classList.add('active');
        currentState = 'q1';
        currentStateDiv.innerHTML = '<i class="fas fa-map-marker-alt"></i> Current State: q1 (Length OK)';
        
        if (hasUppercase) {
            stateQ2.classList.add('active');
            trans1.classList.add('active');
            currentState = 'q2';
            currentStateDiv.innerHTML = '<i class="fas fa-map-marker-alt"></i> Current State: q2 (+Uppercase)';
            
            if (hasDigit) {
                stateQ3.classList.add('active');
                trans2.classList.add('active');
                currentState = 'q3';
                currentStateDiv.innerHTML = '<i class="fas fa-map-marker-alt"></i> Current State: q3 (+Digit)';
                
                if (hasSpecial) {
                    stateQ4.classList.add('active');
                    trans3.classList.add('active');
                    currentState = 'q4';
                    currentStateDiv.innerHTML = '<i class="fas fa-map-marker-alt"></i> Current State: q4 (Accept)';
                }
            }
        }
    }
    
    // Add animation to current state
    const currentStateElement = document.getElementById(`state${currentState.toUpperCase()}`);
    if (currentStateElement) {
        currentStateElement.classList.add('bounce');
        setTimeout(() => {
            currentStateElement.classList.remove('bounce');
        }, 600);
    }
}

function updateRequirement(element, isValid) {
    if (isValid) {
        element.classList.remove('invalid');
        element.classList.add('valid');
        element.querySelector('i').className = 'fas fa-check-circle';
    } else {
        element.classList.remove('valid');
        element.classList.add('invalid');
        element.querySelector('i').className = 'fas fa-times-circle';
    }
}

function updateStrengthBar(strength) {
    strengthBar.style.width = `${strength}%`;
    strengthPercent.textContent = `${strength}%`;
    
    // Remove all classes
    strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    
    // Add appropriate class and text
    if (strength <= 25) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'Very Weak';
        strengthText.style.color = 'var(--danger)';
    } else if (strength <= 50) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'Weak';
        strengthText.style.color = 'var(--danger)';
    } else if (strength <= 75) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = 'Medium';
        strengthText.style.color = 'var(--warning)';
    } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = 'Strong';
        strengthText.style.color = 'var(--success)';
    }
    
    // Add pulse animation
    strengthBar.classList.add('pulse');
    setTimeout(() => {
        strengthBar.classList.remove('pulse');
    }, 500);
}

function showResult(message, type) {
    resultDiv.innerHTML = type === 'accept' ? 
        '<i class="fas fa-check-circle"></i> ACCEPT' : 
        '<i class="fas fa-times-circle"></i> REJECT';
        
    resultDiv.className = 'result';
    resultDiv.classList.add(type, 'show');
    
    // Add shake animation for reject
    if (type === 'reject') {
        resultDiv.classList.add('shake');
        setTimeout(() => {
            resultDiv.classList.remove('shake');
        }, 500);
    }
}

function createConfetti() {
    const colors = [
        getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--success').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--warning').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--danger').trim()
    ];
    
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.width = Math.random() * 8 + 4 + 'px';
        confetti.style.height = Math.random() * 8 + 4 + 'px';
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function generateReportData() {
    const password = passwordInput.value;
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isAccepted = hasMinLength && hasUppercase && hasDigit && hasSpecial;
    
    return {
        password: password,
        hasMinLength: hasMinLength,
        hasUppercase: hasUppercase,
        hasDigit: hasDigit,
        hasSpecial: hasSpecial,
        isAccepted: isAccepted,
        strength: strengthText.textContent,
        currentDate: new Date()
    };
}

function displayReport(data) {
    reportDate.textContent = data.currentDate.toLocaleString();
    
    let strengthClass = 'weak';
    if (data.strength === 'Strong') strengthClass = 'strong';
    else if (data.strength === 'Medium') strengthClass = 'medium';
    
    let strengthPercent = 0;
    if (data.hasMinLength) strengthPercent += 25;
    if (data.hasUppercase) strengthPercent += 25;
    if (data.hasDigit) strengthPercent += 25;
    if (data.hasSpecial) strengthPercent += 25;
    
    // Clone the exact dynamic transition table HTML
    const tableHTML = transitionTable.outerHTML;
    
    reportBody.innerHTML = `
        <div class="report-item">
            <h3>📋 Validation Summary</h3>
            <p><strong>Password:</strong> ${data.password || 'N/A'}</p>
            <p><strong>Status:</strong> ${data.isAccepted ? '<span style="color:var(--success); font-weight:600;">✅ ACCEPTED</span>' : '<span style="color:var(--danger); font-weight:600;">❌ REJECTED</span>'}</p>
            <p><strong>Strength:</strong> ${data.strength}</p>
            <div class="password-meter-report ${strengthClass}">
                <div class="password-meter-report-bar" style="width: ${strengthPercent}%"></div>
            </div>
        </div>
        
        <div class="report-item">
            <h3>✅ Requirement Checks</h3>
            <p>• Length (≥8 chars): ${data.hasMinLength ? '<span style="color:var(--success)">✓ Met</span>' : '<span style="color:var(--danger)">✗ Not Met</span>'}</p>
            <p>• Uppercase letter: ${data.hasUppercase ? '<span style="color:var(--success)">✓ Met</span>' : '<span style="color:var(--danger)">✗ Not Met</span>'}</p>
            <p>• Digit: ${data.hasDigit ? '<span style="color:var(--success)">✓ Met</span>' : '<span style="color:var(--danger)">✗ Not Met</span>'}</p>
            <p>• Special character: ${data.hasSpecial ? '<span style="color:var(--success)">✓ Met</span>' : '<span style="color:var(--danger)">✗ Not Met</span>'}</p>
        </div>
        
        <div class="report-dfa-explanation">
            <h4>🤖 DFA Validation Process</h4>
            <p>The Deterministic Finite Automaton (DFA) validates passwords through 5 states:</p>
            <ol>
                <li><strong>q0 (Start):</strong> Initial state awaiting password input</li>
                <li><strong>q1 (Length):</strong> Reached when password has ≥8 characters</li>
                <li><strong>q2 (Uppercase):</strong> Reached when uppercase letter is detected</li>
                <li><strong>q3 (Digit):</strong> Reached when numeric digit is found</li>
                <li><strong>q4 (Accept):</strong> Final state - all requirements satisfied</li>
            </ol>
            <p>Current DFA State: <strong>q${data.hasMinLength ? (data.hasUppercase ? (data.hasDigit ? (data.hasSpecial ? '4' : '3') : '2') : '1') : '0'}</strong></p>
        </div>
        
        <div class="report-item">
            <h3>📊 Dynamic DFA Transition Table</h3>
            <p style="margin-bottom: 10px; color: var(--text-secondary); font-size: 14px;">
                The exact DFA transition table used for validation with current input:
            </p>
            ${tableHTML}
            <p style="margin-top: 10px; font-size: 14px; color: #7f8c8d;">
                <strong>Highlighted cells</strong> show the transitions that occurred during validation.
            </p>
        </div>
        
        <div class="report-item">
            <h3>🔄 DFA Processing Path</h3>
            <div id="reportDfaPath">${dfaPath.innerHTML}</div>
        </div>
        
        <div class="report-security">
            <h4>🔒 Security Recommendations</h4>
            <ul>
                <li>Use passwords with <strong>12+ characters</strong> for optimal security</li>
                <li>Include a <strong>mix of character types</strong> (uppercase, lowercase, numbers, symbols)</li>
                <li><strong>Avoid common words, patterns, or personal information</strong></li>
                <li>Use a <strong>password manager</strong> to generate and store complex passwords</li>
                <li>Enable <strong>multi-factor authentication</strong> wherever possible</li>
                <li>Change passwords <strong>regularly</strong> and never reuse them across sites</li>
            </ul>
        </div>
        
        <div class="report-item">
            <h3>📊 Validation Metrics</h3>
            <p><strong>Validation Method:</strong> Deterministic Finite Automaton (DFA)</p>
            <p><strong>States Processed:</strong> 5</p>
            <p><strong>Requirements Checked:</strong> 4</p>
            <p><strong>Validation Time:</strong> Instantaneous</p>
            <p><strong>Security Level:</strong> ${data.isAccepted ? 'High' : 'Low'}</p>
        </div>
    `;
    
    // Style the table in the report modal
    const reportTable = reportBody.querySelector('.transition-table');
    if (reportTable) {
        reportTable.style.marginTop = '10px';
        reportTable.style.fontSize = '14px';
    }
}

function generatePDFContent(data, tableHTML) {
    let strengthClass = 'weak';
    if (data.strength === 'Strong') strengthClass = 'strong';
    else if (data.strength === 'Medium') strengthClass = 'medium';
    
    let strengthPercent = 0;
    if (data.hasMinLength) strengthPercent += 25;
    if (data.hasUppercase) strengthPercent += 25;
    if (data.hasDigit) strengthPercent += 25;
    if (data.hasSpecial) strengthPercent += 25;
    
    return `
        <div style="font-family: 'Poppins', sans-serif; color: #2c3e50; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #6a11cb;">
                <h1 style="color: #6a11cb; font-size: 28px; margin-bottom: 10px;">SecurePass DFA Validator</h1>
                <h2 style="color: #2c3e50; font-size: 24px; margin-bottom: 10px;">Password Validation Report</h2>
                <p style="color: #7f8c8d; font-size: 16px;">Generated on ${data.currentDate.toLocaleString()}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 1px solid #e9ecef; padding-bottom: 8px;">📋 Validation Summary</h3>
                <p><strong>Password:</strong> ${data.password || 'N/A'}</p>
                <p><strong>Status:</strong> ${data.isAccepted ? '<span style="color: #00c9a7; font-weight:600;">✅ ACCEPTED</span>' : '<span style="color: #ff5252; font-weight:600;">❌ REJECTED</span>'}</p>
                <p><strong>Strength:</strong> ${data.strength}</p>
                <div style="height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 10px 0;">
                    <div style="height: 100%; width: ${strengthPercent}%; background: ${data.isAccepted ? '#00c9a7' : (data.strength === 'Medium' ? '#ff9e43' : '#ff5252')}; border-radius: 10px;"></div>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 1px solid #e9ecef; padding-bottom: 8px;">✅ Requirement Checks</h3>
                <p>• Length (≥8 chars): ${data.hasMinLength ? '<span style="color: #00c9a7">✓ Met</span>' : '<span style="color: #ff5252">✗ Not Met</span>'}</p>
                <p>• Uppercase letter: ${data.hasUppercase ? '<span style="color: #00c9a7">✓ Met</span>' : '<span style="color: #ff5252">✗ Not Met</span>'}</p>
                <p>• Digit: ${data.hasDigit ? '<span style="color: #00c9a7">✓ Met</span>' : '<span style="color: #ff5252">✗ Not Met</span>'}</p>
                <p>• Special character: ${data.hasSpecial ? '<span style="color: #00c9a7">✓ Met</span>' : '<span style="color: #ff5252">✗ Not Met</span>'}</p>
            </div>
            
            <div style="background: #f0f2f5; border-left: 4px solid #6a11cb; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h4 style="color: #6a11cb; margin-bottom: 10px;">🤖 DFA Validation Process</h4>
                <p>The Deterministic Finite Automaton (DFA) validates passwords through 5 states:</p>
                <ol>
                    <li><strong>q0 (Start):</strong> Initial state awaiting password input</li>
                    <li><strong>q1 (Length):</strong> Reached when password has ≥8 characters</li>
                    <li><strong>q2 (Uppercase):</strong> Reached when uppercase letter is detected</li>
                    <li><strong>q3 (Digit):</strong> Reached when numeric digit is found</li>
                    <li><strong>q4 (Accept):</strong> Final state - all requirements satisfied</li>
                </ol>
                <p>Current DFA State: <strong>q${data.hasMinLength ? (data.hasUppercase ? (data.hasDigit ? (data.hasSpecial ? '4' : '3') : '2') : '1') : '0'}</strong></p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 1px solid #e9ecef; padding-bottom: 8px;">📊 Dynamic DFA Transition Table</h3>
                <p style="margin-bottom: 10px; color: #7f8c8d; font-size: 14px;">
                    The exact DFA transition table used for validation with current input:
                </p>
                ${tableHTML}
                <p style="margin-top: 10px; font-size: 12px; color: #7f8c8d;">
                    <strong>Highlighted cells</strong> show the transitions that occurred during validation.
                </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 1px solid #e9ecef; padding-bottom: 8px;">🔄 DFA Processing Path</h3>
                <div id="reportDfaPath" style="margin-top: 10px; padding: 10px; background: #f0f2f5; border-radius: 8px; font-size: 12px;">
                    ${dfaPath.innerHTML.replace(/<div class="dfa-path-step current">/g, '<span style="display: inline-block; margin: 0 5px; padding: 2px 8px; background: #6a11cb; border-radius: 6px; font-weight: bold; color: white;">')
                      .replace(/<div class="dfa-path-step">/g, '<span style="display: inline-block; margin: 0 5px; padding: 2px 8px; background: #22c55e; border-radius: 6px; font-weight: bold; color: white;">')
                      .replace(/<\/div>/g, '</span>')}
                </div>
            </div>
            
            <div style="background: #e8f5f2; border-left: 4px solid #00c9a7; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <h4 style="color: #00c9a7; margin-bottom: 10px;">🔒 Security Recommendations</h4>
                <ul style="padding-left: 20px;">
                    <li>Use passwords with <strong>12+ characters</strong> for optimal security</li>
                    <li>Include a <strong>mix of character types</strong> (uppercase, lowercase, numbers, symbols)</li>
                    <li><strong>Avoid common words, patterns, or personal information</strong></li>
                    <li>Use a <strong>password manager</strong> to generate and store complex passwords</li>
                    <li>Enable <strong>multi-factor authentication</strong> wherever possible</li>
                    <li>Change passwords <strong>regularly</strong> and never reuse them across sites</li>
                </ul>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px; border-bottom: 1px solid #e9ecef; padding-bottom: 8px;">📊 Validation Metrics</h3>
                <p><strong>Validation Method:</strong> Deterministic Finite Automaton (DFA)</p>
                <p><strong>States Processed:</strong> 5</p>
                <p><strong>Requirements Checked:</strong> 4</p>
                <p><strong>Validation Time:</strong> Instantaneous</p>
                <p><strong>Security Level:</strong> ${data.isAccepted ? 'High' : 'Low'}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #7f8c8d; font-size: 14px;">
                <p>Generated by SecurePass DFA Validator • ${new Date().getFullYear()}</p>
            </div>
        </div>
    `;
}

function updateDynamicTransitionTable(password, hasMinLength, hasUppercase, hasDigit, hasSpecial) {
    // Reset all highlights
    const allCells = document.querySelectorAll('#transitionTable td:not(.state-cell)');
    allCells.forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    // Highlight the path taken based on current conditions
    if (hasMinLength) {
        document.getElementById('q0-length').classList.add('highlight');
        if (hasUppercase) {
            document.getElementById('q1-upper').classList.add('highlight');
            if (hasDigit) {
                document.getElementById('q2-digit').classList.add('highlight');
                if (hasSpecial) {
                    document.getElementById('q3-special').classList.add('highlight');
                }
            }
        }
    }
}

function updateDFAPath(password, hasMinLength, hasUppercase, hasDigit, hasSpecial) {
    dfaPath.innerHTML = '';
    
    // Always start with q0
    const q0 = document.createElement('div');
    q0.className = 'dfa-path-step' + (currentState === 'q0' ? ' current' : '');
    q0.textContent = 'q0';
    dfaPath.appendChild(q0);
    
    if (hasMinLength) {
        const q1 = document.createElement('div');
        q1.className = 'dfa-path-step' + (currentState === 'q1' ? ' current' : '');
        q1.textContent = 'q1';
        dfaPath.appendChild(q1);
        
        if (hasUppercase) {
            const q2 = document.createElement('div');
            q2.className = 'dfa-path-step' + (currentState === 'q2' ? ' current' : '');
            q2.textContent = 'q2';
            dfaPath.appendChild(q2);
            
            if (hasDigit) {
                const q3 = document.createElement('div');
                q3.className = 'dfa-path-step' + (currentState === 'q3' ? ' current' : '');
                q3.textContent = 'q3';
                dfaPath.appendChild(q3);
                
                if (hasSpecial) {
                    const q4 = document.createElement('div');
                    q4.className = 'dfa-path-step' + (currentState === 'q4' ? ' current' : '');
                    q4.textContent = 'q4';
                    dfaPath.appendChild(q4);
                }
            }
        }
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === reportModal) {
        reportModal.style.display = 'none';
    }
});
// Custom Cursor Effect
class CustomCursor {
    constructor() {
        this.cursorVisible = false;
        this.cursorEnlarged = false;
        this.cursorTextHover = false;
        this.endX = window.innerWidth / 2;
        this.endY = window.innerHeight / 2;
        this._x = 0;
        this._y = 0;
        this.trail = [];
        this.trailLength = 10;
        this.requestId = null;
        
        // Initialize cursor elements
        this.initCursor();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start animation loop
        this.animateDotOutline();
    }
    
    initCursor() {
        // Create cursor elements
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot hidden';
        
        this.cursorOutline = document.createElement('div');
        this.cursorOutline.className = 'cursor-dot-outline hidden';
        
        // Add to DOM
        document.body.appendChild(this.cursorDot);
        document.body.appendChild(this.cursorOutline);
        
        // Create trail particles
        for (let i = 0; i < this.trailLength; i++) {
            const trailParticle = document.createElement('div');
            trailParticle.className = 'cursor-trail';
            document.body.appendChild(trailParticle);
            this.trail.push({
                element: trailParticle,
                x: this.endX,
                y: this.endY,
                delay: i * 3
            });
        }
    }
    
    setupEventListeners() {
        // Mouse events
        document.addEventListener('mousemove', (e) => {
            this.cursorVisible = true;
            this.cursorDot.classList.remove('hidden');
            this.cursorOutline.classList.remove('hidden');
            
            this.endX = e.clientX;
            this.endY = e.clientY;
            
            // Update trail positions
            this.updateTrail();
        });
        
        document.addEventListener('mouseenter', () => {
            this.cursorVisible = true;
            this.cursorDot.classList.remove('hidden');
            this.cursorOutline.classList.remove('hidden');
        });
        
        document.addEventListener('mouseleave', () => {
            this.cursorVisible = false;
            this.cursorDot.classList.add('hidden');
            this.cursorOutline.classList.add('hidden');
        });
        
        // Click events
        document.addEventListener('mousedown', () => {
            this.cursorOutline.classList.add('click');
            this.cursorDot.classList.add('pulse');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursorOutline.classList.remove('click');
        });
        
        // Hover events for interactive elements
        const interactiveElements = [
            'button', 'a', 'input', 'textarea', 'select',
            '.theme-toggle', '.copy-btn', '.generate-btn', '.export-btn',
            '.state', '.toggle-password', '.generated-password button',
            '.requirement', '.tooltip'
        ];
        
        interactiveElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.cursorOutline.classList.add('hover');
                    this.cursorOutline.classList.add('pulse');
                    
                    // Special handling for text inputs
                    if (selector === 'input' || selector === 'textarea') {
                        this.cursorOutline.classList.add('text-hover');
                    }
                });
                
                element.addEventListener('mouseleave', () => {
                    this.cursorOutline.classList.remove('hover');
                    this.cursorOutline.classList.remove('text-hover');
                });
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.updateCursorPosition();
        });
        
        // Touch device detection
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            this.destroy();
        }
    }
    
    updateCursorPosition() {
        this._x += (this.endX - this._x) * 0.15;
        this._y += (this.endY - this._y) * 0.15;
        
        this.cursorDot.style.left = this._x + 'px';
        this.cursorDot.style.top = this._y + 'px';
        
        this.cursorOutline.style.left = this.endX + 'px';
        this.cursorOutline.style.top = this.endY + 'px';
    }
    
    updateTrail() {
        this.trail.forEach((particle, index) => {
            setTimeout(() => {
                particle.x += (this.endX - particle.x) * 0.3;
                particle.y += (this.endY - particle.y) * 0.3;
                
                const opacity = 1 - (index / this.trailLength);
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
                particle.element.style.opacity = opacity;
                particle.element.style.backgroundColor = `rgba(106, 17, 203, ${0.3 * opacity})`;
            }, particle.delay);
        });
    }
    
    animateDotOutline() {
        this.updateCursorPosition();
        this.requestId = requestAnimationFrame(this.animateDotOutline.bind(this));
    }
    
    // Special effects for specific events
    showSuccessEffect() {
        this.cursorOutline.classList.add('expand');
        this.cursorDot.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--success').trim();
        this.cursorOutline.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--success').trim();
        
        setTimeout(() => {
            this.cursorOutline.classList.remove('expand');
            this.cursorDot.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            this.cursorOutline.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        }, 500);
    }
    
    showErrorEffect() {
        this.cursorOutline.classList.add('pulse');
        this.cursorDot.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--danger').trim();
        this.cursorOutline.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--danger').trim();
        
        setTimeout(() => {
            this.cursorDot.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            this.cursorOutline.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        }, 300);
    }
    
    destroy() {
        // Remove cursor elements
        if (this.cursorDot) this.cursorDot.remove();
        if (this.cursorOutline) this.cursorOutline.remove();
        this.trail.forEach(particle => particle.element.remove());
        
        // Cancel animation frame
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
        
        // Remove cursor hiding from all elements
        document.querySelectorAll('*').forEach(el => {
            el.style.cursor = '';
        });
    }
}

// Initialize custom cursor
let customCursor = null;

// Initialize cursor after DOM is loaded
function initCustomCursor() {
    // Only initialize on non-touch devices
    if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        customCursor = new CustomCursor();
        
        // Add cursor effects for specific actions
        const copyBtn = document.getElementById('copyBtn');
        const generateBtn = document.getElementById('generateBtn');
        const exportBtn = document.getElementById('exportBtn');
        const passwordInput = document.getElementById('password');
        
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (customCursor) customCursor.showSuccessEffect();
            });
        }
        
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                if (customCursor) customCursor.showSuccessEffect();
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (customCursor) customCursor.showSuccessEffect();
            });
        }
        
        // Add effect when password is accepted
        const originalValidatePassword = validatePassword;
        window.validatePassword = function(password) {
            const result = originalValidatePassword(password);
            
            // Show cursor effect if password is accepted
            const hasMinLength = password.length >= 8;
            const hasUppercase = /[A-Z]/.test(password);
            const hasDigit = /[0-9]/.test(password);
            const hasSpecial = /[^A-Za-z0-9]/.test(password);
            
            if (hasMinLength && hasUppercase && hasDigit && hasSpecial) {
                if (customCursor) customCursor.showSuccessEffect();
            } else if (password.length > 0) {
                if (customCursor) customCursor.showErrorEffect();
            }
            
            return result;
        };
    }
}

// Call initCustomCursor after your existing initialization
initCustomCursor();

// Update cursor theme when theme changes
themeToggle.addEventListener('click', function() {
    if (customCursor) {
        // Update cursor colors based on theme
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-dot-outline');
        
        if (cursorDot) {
            cursorDot.style.backgroundColor = primaryColor;
        }
        if (cursorOutline) {
            cursorOutline.style.borderColor = primaryColor;
        }
    }
});
});