*** Settings ***
# Import RobotFramework Browser library
Library     Browser


*** Keywords ***
Open Login Page

# Open browser with Chronium, headless=False makes it visible
# Could add slowMo to add delay - may come useful !!
    New Browser  chromium       headless=False
    New Page        ${BASE_URL}

Login With Credentials

# Expects two arguments
    [Arguments]     ${USERNAME}      ${PASSWORD}

#Check that id's are correct !!
    Fill Text       id=user-name       ${USERNAME}
    Fill Text       id=password        ${PASSWORD}
    Click       id=login-button
