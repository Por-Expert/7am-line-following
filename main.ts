function Left (MotorSpeed: number, Time: number) {
    Motor_Stop()
    iBIT.Spin(ibitSpin.Left, MotorSpeed)
    basic.pause(Time)
    Motor_Stop()
}
function TracSonar () {
    Initial_Speed()
    Sonar()
    while (Distance > DistanceRef) {
        Start = input.runningTime()
        Timer = 0
        while (Timer < 100) {
            Cal_Error()
            Trac_PID()
            Timer = input.runningTime() - Start
        }
        Sonar()
    }
    CurveRight(60, 90)
}
function Turn_Right () {
    Motor_Stop()
    iBIT.Spin(ibitSpin.Right, Turn_Speed)
    basic.pause(8500 / Turn_Speed)
    if (Turn_Speed >= 60) {
        iBIT.Spin(ibitSpin.Right, 50)
    }
    ConvertADC()
    while (R2 == 1) {
        ConvertADC()
    }
    Motor_Stop()
}
function Straight100ms () {
    Forward()
    basic.pause(100)
}
function Forward () {
    iBIT.Motor2(ibitMotor.Forward, Base_Left_Speed, Base_Right_Speed)
}
function Round1 () {
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
}
function Show4ADC () {
    Read4ADC()
    basic.showNumber(L2)
    basic.pause(5000)
    basic.showNumber(L1)
    basic.pause(5000)
    basic.showNumber(R1)
    basic.pause(5000)
    basic.showNumber(R2)
}
function Trac_ms () {
    let Trac_Time = 0
    Initial_Speed()
    Start = input.runningTime()
    Timer = 0
    while (Timer < Trac_Time) {
        Trac_PID()
        basic.pause(Kt)
        Timer = input.runningTime() - Start
        Cal_Error()
    }
}
function Read4ADC () {
    L2 = iBIT.ReadADC(ibitReadADC.ADC0)
    L1 = iBIT.ReadADC(ibitReadADC.ADC1)
    R1 = iBIT.ReadADC(ibitReadADC.ADC2)
    R2 = iBIT.ReadADC(ibitReadADC.ADC3)
}
function Sonar () {
    Distance = sonar.ping(
    DigitalPin.P0,
    DigitalPin.P1,
    PingUnit.Centimeters
    )
    if (Distance == 0) {
        Distance = 1000
    }
}
function Trac_ms_Speed () {
    Base_Speed = ACC_Speed
    Trac_ms()
    Base_Speed = Speed
}
input.onButtonPressed(Button.A, function () {
    Round1()
    Finish()
})
function UTurn () {
    Motor_Stop()
    iBIT.Spin(ibitSpin.Left, Turn_Speed)
    basic.pause(20000 / Turn_Speed)
    if (Turn_Speed >= 50) {
        iBIT.Spin(ibitSpin.Left, 40)
    }
    ConvertADC()
    while (L2 == 1) {
        ConvertADC()
    }
    Motor_Stop()
}
function TracJC_Slow_Stop () {
    Base_Speed = Slow_Speed
    TracJC_Stop()
    Base_Speed = Speed
    Initial_Speed()
}
function Turn_Left () {
    Motor_Stop()
    iBIT.Spin(ibitSpin.Left, Turn_Speed)
    basic.pause(8500 / Turn_Speed)
    if (Turn_Speed >= 60) {
        iBIT.Spin(ibitSpin.Left, 50)
    }
    ConvertADC()
    while (L2 == 1) {
        ConvertADC()
    }
    Motor_Stop()
}
function Finish () {
    iBIT.MotorStop()
    while (true) {
    	
    }
}
function TracJC () {
    TracJC_Stop()
    Forward()
    if (Base_Speed <= 60) {
        basic.pause(4000 / Base_Speed)
    } else if (Base_Speed <= 70) {
        basic.pause(2000 / Base_Speed)
    } else if (Base_Speed <= 80) {
        basic.pause(500 / Base_Speed)
    }
}
function Trac_PID () {
    if (Math.abs(error) <= 0) {
        KpTemp = 1
    } else {
        KpTemp = Kp
    }
    Output = KpTemp * error + (Ki * Sum_error + Kd * (error - Pre_error))
    Left_Speed = Base_Left_Speed + Output
    Right_Speed = Base_Right_Speed - Output
    if (Left_Speed > Max_Speed) {
        Left_Speed = Max_Speed
    }
    if (Left_Speed < -1 * Max_Speed) {
        Left_Speed = -1 * Max_Speed
    }
    if (Right_Speed > Max_Speed) {
        Right_Speed = Max_Speed
    }
    if (Right_Speed < -1 * Max_Speed) {
        Right_Speed = -1 * Max_Speed
    }
    if (Left_Speed > 0) {
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Forward, Left_Speed)
    } else {
        iBIT.setMotor(ibitMotorCH.M1, ibitMotor.Backward, Left_Speed)
    }
    if (Right_Speed > 0) {
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Forward, Right_Speed)
    } else {
        iBIT.setMotor(ibitMotorCH.M2, ibitMotor.Backward, Right_Speed)
    }
    Pre_error = error
    Sum_error += error
}
function ConvertADC () {
    let Ref_R3 = 0
    let Ref_C = 0
    let Ref_L3 = 0
    Read4ADC()
    if (L3 < Ref_L3) {
        L3 = 0
    } else {
        L3 = 1
    }
    if (L2 < Ref_L2) {
        L2 = 0
    } else {
        L2 = 1
    }
    if (L1 < Ref_L1) {
        L1 = 0
    } else {
        L1 = 1
    }
    if (C < Ref_C) {
        C = 0
    } else {
        C = 1
    }
    if (R1 < Ref_R1) {
        R1 = 0
    } else {
        R1 = 1
    }
    if (R2 < Ref_R2) {
        R2 = 0
    } else {
        R2 = 1
    }
    if (R3 < Ref_R3) {
        R3 = 0
    } else {
        R3 = 1
    }
}
input.onButtonPressed(Button.B, function () {
    Show4ADC()
    basic.pause(5000)
    Sonar()
    basic.showNumber(Distance)
})
function Robot_Start () {
    Base_Speed = Slow_Speed
    Initial_Speed()
    Forward()
    basic.pause(300)
    Base_Speed = Speed
    Initial_Speed()
}
function CurveRight (MotorSpeed: number, Time: number) {
    Right(MotorSpeed, 170)
    iBIT.Motor2(ibitMotor.Forward, 0.6 * MotorSpeed, MotorSpeed)
    basic.pause(700)
    ConvertADC()
    while (R1 == 0) {
        ConvertADC()
    }
    while (true) {
        ConvertADC()
    }
    basic.pause(Time)
    Turn_Right()
}
function TracJC_Speed () {
    Base_Speed = ACC_Speed
    TracJC_Stop()
    Forward()
    Cal_Error()
    while (error >= 100) {
        Cal_Error()
    }
    basic.pause(2000 / Base_Speed)
    Base_Speed = Speed
    Initial_Speed()
}
function Cal_Error () {
    ConvertADC()
    if (L2 == 1 && (L1 == 1 && (R1 == 1 && R2 == 0))) {
        error = 3
    } else if (L2 == 1 && (L1 == 1 && (R1 == 0 && R2 == 0))) {
        error = 2
    } else if (L2 == 1 && (L1 == 1 && (R1 == 0 && R2 == 1))) {
        error = 1
    } else if (L2 == 1 && (L1 == 0 && (R1 == 0 && R2 == 1))) {
        error = 0
    } else if (L2 == 1 && (L1 == 0 && (R1 == 1 && R2 == 1))) {
        error = -1
    } else if (L2 == 0 && (L1 == 0 && (R1 == 1 && R2 == 1))) {
        error = -2
    } else if (L2 == 0 && (L1 == 1 && (R1 == 1 && R2 == 1))) {
        error = -3
    } else if (L2 == 0 && (L1 == 0 && (R1 == 0 && R2 == 0))) {
        error = 100
    } else if (L2 == 1 && (L1 == 0 && (R1 == 0 && R2 == 0))) {
        error = 1
    } else if (L2 == 0 && (L1 == 0 && (R1 == 0 && R2 == 1))) {
        error = -1
    }
}
function Right (MotorSpeed: number, Time: number) {
    Motor_Stop()
    iBIT.Spin(ibitSpin.Right, MotorSpeed)
    basic.pause(Time)
    Motor_Stop()
}
function TracJC_Stop () {
    Initial_Speed()
    Cal_Error()
    while (error < 99) {
        Trac_PID()
        Start = input.runningTime()
        Timer = 0
        while (Timer < Kt && error < 99) {
            Timer = input.runningTime() - Start
            Cal_Error()
        }
    }
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    basic.pause(2000)
    Sonar()
    basic.showNumber(Distance)
})
function Initial_Speed () {
    Max_Speed = Base_Speed + 5
    if (Max_Speed > 100) {
        Max_Speed = 100
    }
    Ki = 0
    error = 0
    Pre_error = 0
    Sum_error = 0
    if (Base_Speed <= 60) {
        Base_Left_Speed = Base_Speed - 1
        Base_Right_Speed = Base_Speed - 0
        Kp = 14
        Kd = 160
        Kt = 1.5
    } else if (Base_Speed <= 70) {
        Base_Left_Speed = Base_Speed - 2
        Base_Right_Speed = Base_Speed - 0
        Kp = 18
        Kd = 160
        Kt = 2.5
    } else if (Base_Speed <= 80) {
        Base_Left_Speed = Base_Speed - 3
        Base_Right_Speed = Base_Speed - 0
        Kp = 23
        Kd = 160
        Kt = 3.5
    } else if (Base_Speed <= 90) {
        Base_Left_Speed = Base_Speed - 5
        Base_Right_Speed = Base_Speed - 0
        Kp = 28
        Kd = 160
        Kt = 4.5
    } else {
        Base_Left_Speed = Base_Speed - 8
        Base_Right_Speed = Base_Speed - 0
        Kp = 33
        Kd = 40
        Kt = 5.5
    }
}
function Backward () {
    iBIT.Motor2(ibitMotor.Backward, Base_Left_Speed, Base_Right_Speed)
}
function Motor_Stop () {
    iBIT.MotorStop()
    basic.pause(10)
}
let R3 = 0
let C = 0
let L3 = 0
let Max_Speed = 0
let Right_Speed = 0
let Left_Speed = 0
let Pre_error = 0
let Kd = 0
let Sum_error = 0
let Ki = 0
let Output = 0
let Kp = 0
let KpTemp = 0
let error = 0
let Kt = 0
let R1 = 0
let L1 = 0
let L2 = 0
let Base_Right_Speed = 0
let Base_Left_Speed = 0
let R2 = 0
let Timer = 0
let Start = 0
let Distance = 0
let Ref_R2 = 0
let Ref_R1 = 0
let Ref_L1 = 0
let Ref_L2 = 0
let DistanceRef = 0
let Turn_Speed = 0
let Base_Speed = 0
let Slow_Speed = 0
let ACC_Speed = 0
let Speed = 0
iBIT.setADC_Address(adcAddress.iBIT_V2)
Speed = 95
ACC_Speed = 85
Slow_Speed = 70
Base_Speed = Speed
Turn_Speed = Base_Speed
DistanceRef = 15
Initial_Speed()
Ref_L2 = 622
Ref_L1 = 650
Ref_R1 = 565.5
Ref_R2 = 649.5
basic.showIcon(IconNames.Heart)
