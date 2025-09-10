import random

def rndURL():
    i = 0
    s = ""
    while(i < 6):
        rndNr = int(random.uniform(0, 9)) + 48 
        if(rndNr >= 48 and rndNr <= 57):
            s += chr(rndNr)
            i += 1
    return s
