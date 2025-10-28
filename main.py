def Left(MotorSpeed: number, Time: number):
    Motor_Stop()
    iBIT.spin(ibitSpin.LEFT, MotorSpeed)
    basic.pause(Time)
    Motor_Stop()
def TracSonar():
    global Start, Timer
    Initial_Speed()
    Sonar()
    while Distance > DistanceRef:
        Start = input.running_time()
        Timer = 0
        while Timer < 100:
            Cal_Error()
            Trac_PID()
            Timer = input.running_time() - Start
        Sonar()
    CurveRight(60, 90)
def Turn_Right():
    Motor_Stop()
    iBIT.spin(ibitSpin.RIGHT, Turn_Speed)
    basic.pause(5000 / Turn_Speed)
    if Turn_Speed >= 60:
        iBIT.spin(ibitSpin.RIGHT, 50)
    ConvertADC()
    while R2 == 1:
        ConvertADC()
    Motor_Stop()
def Straight100ms():
    Forward()
    basic.pause(100)
def Forward():
    iBIT.motor2(ibitMotor.FORWARD, Base_Left_Speed, Base_Right_Speed)
def Round1():
    TracJC_Speed()
    TracJC_Speed()
    TracJC_Speed()
    TracJC_Speed()
    TracJC()
    TracJC_Speed()
    TracJC_Speed()
    TracJC_Speed()
    TracJC_Speed()
    TracJC_Speed()
    TracSonar()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Right()
    TracJC()
    Turn_Left()
    TracJC()
    UTurn()
def Show4ADC():
    Read4ADC()
    basic.show_number(L2)
    basic.pause(5000)
    basic.show_number(L1)
    basic.pause(5000)
    basic.show_number(R1)
    basic.pause(5000)
    basic.show_number(R2)
def Trac_ms():
    global Start, Timer
    Trac_Time = 0
    Initial_Speed()
    Start = input.running_time()
    Timer = 0
    while Timer < Trac_Time:
        Trac_PID()
        basic.pause(Kt)
        Timer = input.running_time() - Start
        Cal_Error()
def Read4ADC():
    global L2, L1, R1, R2
    L2 = iBIT.read_adc(ibitReadADC.ADC0)
    L1 = iBIT.read_adc(ibitReadADC.ADC1)
    R1 = iBIT.read_adc(ibitReadADC.ADC2)
    R2 = iBIT.read_adc(ibitReadADC.ADC3)
def Sonar():
    global Distance
    Distance = sonar.ping(DigitalPin.P0, DigitalPin.P1, PingUnit.CENTIMETERS)
    if Distance == 0:
        Distance = 1000
def Trac_ms_Speed():
    global Base_Speed
    Base_Speed = ACC_Speed
    Trac_ms()
    Base_Speed = Speed

def on_button_pressed_a():
    Round1()
    Finish()
input.on_button_pressed(Button.A, on_button_pressed_a)

def UTurn():
    Motor_Stop()
    iBIT.spin(ibitSpin.LEFT, Turn_Speed)
    basic.pause(20000 / Turn_Speed)
    if Turn_Speed >= 50:
        iBIT.spin(ibitSpin.LEFT, 40)
    ConvertADC()
    while L2 == 1:
        ConvertADC()
    Motor_Stop()
def TracJC_Slow_Stop():
    global Base_Speed
    Base_Speed = Slow_Speed
    TracJC_Stop()
    Base_Speed = Speed
    Initial_Speed()
def Turn_Left():
    Motor_Stop()
    iBIT.spin(ibitSpin.LEFT, Turn_Speed)
    basic.pause(5000 / Turn_Speed)
    if Turn_Speed >= 60:
        iBIT.spin(ibitSpin.LEFT, 50)
    ConvertADC()
    while L2 == 1:
        ConvertADC()
    Motor_Stop()
def Finish():
    iBIT.motor_stop()
    while True:
        pass
def TracJC():
    TracJC_Stop()
    Forward()
    if Base_Speed <= 60:
        basic.pause(4000 / Base_Speed)
    elif Base_Speed <= 70:
        basic.pause(2000 / Base_Speed)
    elif Base_Speed <= 80:
        basic.pause(500 / Base_Speed)
def Trac_PID():
    global KpTemp, Output, Left_Speed, Right_Speed, Pre_error, Sum_error
    if abs(error) <= 0:
        KpTemp = 1
    else:
        KpTemp = Kp
    Output = KpTemp * error + (Ki * Sum_error + Kd * (error - Pre_error))
    Left_Speed = Base_Left_Speed + Output
    Right_Speed = Base_Right_Speed - Output
    if Left_Speed > Max_Speed:
        Left_Speed = Max_Speed
    if Left_Speed < -1 * Max_Speed:
        Left_Speed = -1 * Max_Speed
    if Right_Speed > Max_Speed:
        Right_Speed = Max_Speed
    if Right_Speed < -1 * Max_Speed:
        Right_Speed = -1 * Max_Speed
    if Left_Speed > 0:
        iBIT.set_motor(ibitMotorCH.M1, ibitMotor.FORWARD, Left_Speed)
    else:
        iBIT.set_motor(ibitMotorCH.M1, ibitMotor.BACKWARD, Left_Speed)
    if Right_Speed > 0:
        iBIT.set_motor(ibitMotorCH.M2, ibitMotor.FORWARD, Right_Speed)
    else:
        iBIT.set_motor(ibitMotorCH.M2, ibitMotor.BACKWARD, Right_Speed)
    Pre_error = error
    Sum_error += error
def ConvertADC():
    global L3, L2, L1, C, R1, R2, R3
    Ref_R3 = 0
    Ref_C = 0
    Ref_L3 = 0
    Read4ADC()
    if L3 < Ref_L3:
        L3 = 0
    else:
        L3 = 1
    if L2 < Ref_L2:
        L2 = 0
    else:
        L2 = 1
    if L1 < Ref_L1:
        L1 = 0
    else:
        L1 = 1
    if C < Ref_C:
        C = 0
    else:
        C = 1
    if R1 < Ref_R1:
        R1 = 0
    else:
        R1 = 1
    if R2 < Ref_R2:
        R2 = 0
    else:
        R2 = 1
    if R3 < Ref_R3:
        R3 = 0
    else:
        R3 = 1

def on_button_pressed_b():
    Show4ADC()
    basic.pause(5000)
    Sonar()
    basic.show_number(Distance)
input.on_button_pressed(Button.B, on_button_pressed_b)

def Robot_Start():
    global Base_Speed
    Base_Speed = Slow_Speed
    Initial_Speed()
    Forward()
    basic.pause(300)
    Base_Speed = Speed
    Initial_Speed()
def CurveRight(MotorSpeed2: number, Time2: number):
    Right(MotorSpeed2, 170)
    iBIT.motor2(ibitMotor.FORWARD, 0.6 * MotorSpeed2, MotorSpeed2)
    basic.pause(700)
    ConvertADC()
    while R1 == 0:
        ConvertADC()
    while R1 == 1:
        ConvertADC()
    basic.pause(Time2)
    Turn_Right()
def TracJC_Speed():
    global Base_Speed
    Base_Speed = ACC_Speed
    TracJC_Stop()
    Forward()
    Cal_Error()
    while error >= 100:
        Cal_Error()
    basic.pause(2000 / Base_Speed)
    Base_Speed = Speed
    Initial_Speed()
def Cal_Error():
    global error
    ConvertADC()
    if L2 == 1 and (L1 == 1 and (R1 == 1 and R2 == 0)):
        error = 3
    elif L2 == 1 and (L1 == 1 and (R1 == 0 and R2 == 0)):
        error = 2
    elif L2 == 1 and (L1 == 1 and (R1 == 0 and R2 == 1)):
        error = 1
    elif L2 == 1 and (L1 == 0 and (R1 == 0 and R2 == 1)):
        error = 0
    elif L2 == 1 and (L1 == 0 and (R1 == 1 and R2 == 1)):
        error = -1
    elif L2 == 0 and (L1 == 0 and (R1 == 1 and R2 == 1)):
        error = -2
    elif L2 == 0 and (L1 == 1 and (R1 == 1 and R2 == 1)):
        error = -3
    elif L2 == 0 and (L1 == 0 and (R1 == 0 and R2 == 0)):
        error = 100
    elif L2 == 1 and (L1 == 0 and (R1 == 0 and R2 == 0)):
        error = 1
    elif L2 == 0 and (L1 == 0 and (R1 == 0 and R2 == 1)):
        error = -1
def Right(MotorSpeed3: number, Time3: number):
    Motor_Stop()
    iBIT.spin(ibitSpin.RIGHT, MotorSpeed3)
    basic.pause(Time3)
    Motor_Stop()
def TracJC_Stop():
    global Start, Timer
    Initial_Speed()
    Cal_Error()
    while error < 99:
        Trac_PID()
        Start = input.running_time()
        Timer = 0
        while Timer < Kt and error < 99:
            Timer = input.running_time() - Start
            Cal_Error()
def Initial_Speed():
    global Max_Speed, Ki, error, Pre_error, Sum_error, Base_Left_Speed, Base_Right_Speed, Kp, Kd, Kt
    Max_Speed = Base_Speed + 5
    if Max_Speed > 100:
        Max_Speed = 100
    Ki = 0
    error = 0
    Pre_error = 0
    Sum_error = 0
    if Base_Speed <= 60:
        Base_Left_Speed = Base_Speed - 1
        Base_Right_Speed = Base_Speed - 0
        Kp = 16
        Kd = 160
        Kt = 5
    elif Base_Speed <= 70:
        Base_Left_Speed = Base_Speed - 2
        Base_Right_Speed = Base_Speed - 0
        Kp = 20
        Kd = 160
        Kt = 6
    elif Base_Speed <= 80:
        Base_Left_Speed = Base_Speed - 3
        Base_Right_Speed = Base_Speed - 0
        Kp = 25
        Kd = 160
        Kt = 7
    elif Base_Speed <= 90:
        Base_Left_Speed = Base_Speed - 5
        Base_Right_Speed = Base_Speed - 0
        Kp = 30
        Kd = 160
        Kt = 8
    else:
        Base_Left_Speed = Base_Speed - 8
        Base_Right_Speed = Base_Speed - 0
        Kp = 35
        Kd = 40
        Kt = 9
def Backward():
    iBIT.motor2(ibitMotor.BACKWARD, Base_Left_Speed, Base_Right_Speed)
def Motor_Stop():
    iBIT.motor_stop()
    basic.pause(10)
R3 = 0
C = 0
L3 = 0
Max_Speed = 0
Right_Speed = 0
Left_Speed = 0
Pre_error = 0
Kd = 0
Sum_error = 0
Ki = 0
Output = 0
Kp = 0
KpTemp = 0
error = 0
Kt = 0
R1 = 0
L1 = 0
L2 = 0
Base_Right_Speed = 0
Base_Left_Speed = 0
R2 = 0
Timer = 0
Start = 0
Distance = 0
Ref_R2 = 0
Ref_R1 = 0
Ref_L1 = 0
Ref_L2 = 0
DistanceRef = 0
Turn_Speed = 0
Base_Speed = 0
Slow_Speed = 0
ACC_Speed = 0
Speed = 0
iBIT.setADC_Address(adcAddress.IBIT_V2)
Speed = 100
ACC_Speed = 60
Slow_Speed = 50
Base_Speed = Speed
Turn_Speed = Base_Speed
DistanceRef = 15
Initial_Speed()
Ref_L2 = 622
Ref_L1 = 650
Ref_R1 = 565.5
Ref_R2 = 649.5
basic.show_icon(IconNames.HEART)