class DrivingBase {
    static motor_max_rpm: number
    private ___motor_max_rpm_is_set: boolean
    private ___motor_max_rpm: number
    get motor_max_rpm(): number {
        return this.___motor_max_rpm_is_set ? this.___motor_max_rpm : DrivingBase.motor_max_rpm
    }
    set motor_max_rpm(value: number) {
        this.___motor_max_rpm_is_set = true
        this.___motor_max_rpm = value
    }
    
    static wheel_diameter: number
    private ___wheel_diameter_is_set: boolean
    private ___wheel_diameter: number
    get wheel_diameter(): number {
        return this.___wheel_diameter_is_set ? this.___wheel_diameter : DrivingBase.wheel_diameter
    }
    set wheel_diameter(value: number) {
        this.___wheel_diameter_is_set = true
        this.___wheel_diameter = value
    }
    
    public static __initDrivingBase() {
        //  Motor/wheel properties
        DrivingBase.motor_max_rpm = 70
        //  Maximum RPM of motors
        DrivingBase.wheel_diameter = 6.5
    }
    
    //  Diameter of wheels in cm
    //  Initialize
    constructor(motor_max_rpm: number, wheel_diameter: number) {
        //  Configure properties
        this.motor_max_rpm = motor_max_rpm
        this.wheel_diameter = wheel_diameter
    }
    
    //  ## Motor-specific math
    public get_motor_degps(): number {
        return this.motor_max_rpm * 6
    }
    
    public get_motor_cmps(): number {
        return this.wheel_diameter * this.motor_max_rpm * 0.0523
    }
    
    //  ## Movement-specific math
    public distance_to_time(distance: number): number {
        return Math.abs(distance / this.get_motor_cmps())
    }
    
    public degrees_to_time(degrees: number): number {
        return Math.abs(degrees / this.get_motor_degps())
    }
    
    public modify_time_by_speed(time: number, speed: number): number {
        return Math.abs(time * 100 / speed)
    }
    
    public speed_from_distance_time(distance: number, time: number): number {
        return distance / (time * this.get_motor_cmps())
    }
    
    //  ## Movement functions
    public set_both_motors(direction: number, speed: number) {
        motobit.setMotorSpeed(Motor.Left, direction, speed)
        motobit.setMotorSpeed(Motor.Right, direction, speed)
    }
    
    public stop_motors() {
        motobit.setMotorSpeed(Motor.Left, MotorDirection.Forward, 0)
        motobit.setMotorSpeed(Motor.Right, MotorDirection.Forward, 0)
    }
    
    public moveConstructDistance(distance: number, speed: number) {
        //  Positive distance moves forward, negative distance moves backwards
        let direction = distance > 0 ? MotorDirection.Reverse : MotorDirection.Forward
        let pause_time = this.modify_time_by_speed(this.distance_to_time(distance) * 1000, speed)
        this.set_both_motors(direction, speed)
        pause(pause_time)
        this.stop_motors()
    }
    
    public turnConstructDegrees(degrees: number, speed: number) {
        //  Positive degrees moves left, negative degrees moves right
        let left_direction = degrees > 0 ? MotorDirection.Reverse : MotorDirection.Forward
        let right_direction = degrees > 0 ? MotorDirection.Forward : MotorDirection.Reverse
        let pause_time = this.modify_time_by_speed(this.degrees_to_time(degrees * 4) * 1000, speed)
        motobit.setMotorSpeed(Motor.Left, left_direction, speed)
        motobit.setMotorSpeed(Motor.Right, right_direction, speed)
        pause(pause_time)
        this.stop_motors()
    }
    
}

DrivingBase.__initDrivingBase()

let base = new DrivingBase(140, 6.5)
console.log(base.get_motor_degps())
console.log(base.get_motor_cmps())
