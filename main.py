class DrivingBase:
    # Motor/wheel properties
    motor_max_rpm = 70 # Maximum RPM of motors
    wheel_diameter = 6.5 # Diameter of wheels in cm

    # Initialize
    def __init__(self, motor_max_rpm, wheel_diameter):
        # Configure properties
        self.motor_max_rpm = motor_max_rpm
        self.wheel_diameter = wheel_diameter
    
    # ## Motor-specific math
    def get_motor_degps(self):
        return self.motor_max_rpm*6
    def get_motor_cmps(self):
        return self.wheel_diameter*self.motor_max_rpm*0.0523
    
    # ## Movement-specific math
    def distance_to_time(self, distance):
        return abs(distance/self.get_motor_cmps())
    def degrees_to_time(self, degrees):
        return abs(degrees/self.get_motor_degps())
    def modify_time_by_speed(self, time, speed):
        return abs(time*100/speed)
    def speed_from_distance_time(self, distance, time):
        return distance/(time*self.get_motor_cmps())
    
    # ## Movement functions
    def set_both_motors(self, direction, speed):
        motobit.set_motor_speed(Motor.LEFT, direction, speed)
        motobit.set_motor_speed(Motor.RIGHT, direction, speed)
    def stop_motors(self):
        motobit.set_motor_speed(Motor.LEFT, MotorDirection.FORWARD, 0)
        motobit.set_motor_speed(Motor.RIGHT, MotorDirection.FORWARD, 0)
    def moveConstructDistance(self, distance, speed):
        # Positive distance moves forward, negative distance moves backwards
        direction = MotorDirection.REVERSE if distance > 0 else MotorDirection.FORWARD
        pause_time = self.modify_time_by_speed(self.distance_to_time(distance)*1000, speed)
        self.set_both_motors(direction, speed)
        pause(pause_time)
        self.stop_motors()
    def turnConstructDegrees(self, degrees, speed):
        # Positive degrees moves left, negative degrees moves right
        left_direction = MotorDirection.REVERSE if degrees > 0 else MotorDirection.FORWARD
        right_direction = MotorDirection.FORWARD if degrees > 0 else MotorDirection.REVERSE
        pause_time = self.modify_time_by_speed(self.degrees_to_time(degrees*4)*1000, speed)
        motobit.set_motor_speed(Motor.LEFT, left_direction, speed)
        motobit.set_motor_speed(Motor.RIGHT, right_direction, speed)
        pause(pause_time)
        self.stop_motors()

base = DrivingBase(140, 6.5)
print(base.get_motor_degps())
print(base.get_motor_cmps())
