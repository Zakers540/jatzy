import random

def rndURL():
    i = 0
    s = ""
    while(i < 10):
        rndCh = int(random.uniform(0, 1) * 127)
        if(rndCh * 127 >= 32):
            s += chr(rndCh)
            i += 1
    return s