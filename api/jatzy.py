import random

def rndURL():
    i = 0
    s = ""
    while(i < 6):
        rndCh = int(random.uniform(0, 1) * 127)
        if(rndCh > 48 and rndCh < 57):
            s += chr(rndCh)
            i += 1
    return s

for i in range(20):
    print(rndURL())