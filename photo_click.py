import cv2
import os
import threading
import time

# cap=cv2.VideoCapture("http://10.81.49.228:8080/video")
cap=cv2.VideoCapture("http://10.81.50.151:8080/video")
# cap=cv2.VideoCapture("http://192.168.1.17:8080/video")
# cap=cv2.VideoCapture(0)
# 
# Image folder if not exist dynamically will generate

if(not os.path.exists("Images")):
    os.mkdir("Images")

  


def save_img():
    count=0
    count+=1
    cv2.imwrite(f"Images/{len(os.listdir('images02')) + count}.jpg", frame)
    print("Image saved succesfully")
    time.sleep(3)
    



while True:
    ret,frame=cap.read()
    count=0

    if ret==True:
        frame = cv2.resize(frame, (1280, 720))
        cv2.imshow("img_frame , 's' to save the image, 'q' to quit ",frame)
        key=cv2.waitKey(1) 
        if key==ord("q"):
            break
        if key==ord("s"):
            count+=1
            cv2.imwrite(f"Images/{len(os.listdir('Images')) + count}.jpg", frame)
            print("Image saved succesfully")

       

    else:
        print("Somthing went wrong!! check the ip")


       
        

cap.release()
cv2.destroyAllWindows()