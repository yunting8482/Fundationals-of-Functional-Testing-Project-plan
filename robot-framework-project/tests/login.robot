*** Settings ***
Resource        ../resources/common_keywords.robot
Resource        ../resources/variables.robot

Suite Setup     Open Login Page

*** Test Cases ***

TC-01 Successful Login
    [Documentation]    Verify that a user can successfully log in.
    Enter Username
    Enter Password
    Click Login Button
#    Wait For Elements State    text=Products    visible    timeout=10s