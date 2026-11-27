*** Settings ***
# Import RobotFramework Browser library
Library     Browser


*** Keywords ***
Open Login Page

# Open browser with Chronium, headless=False makes it visible
# Could add slowMo to add delay - may come useful !!
    New Browser  chromium       headless=False
    New Page        ${BASE_URL}

Enter Username
    Fill Text       id=user-name       ${USERNAME}

Enter Password
    Fill Text       id=password        ${PASSWORD}

Click Login Button
    Click           id=login-button
