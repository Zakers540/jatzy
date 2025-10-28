def yatzy(dice1Number, dice2Number, dice3Number, dice4Number, dice5Number, playerIndex = 1):
    data = request.get_json(silent=True) or {}
    result = data.get("yatzySheet")
    allDice = [dice1Number, dice2Number, dice3Number, dice4Number, dice5Number]
    numberOfNumbers = [0, 0, 0, 0, 0, 0]
    hasThree = False
    hasThreeVariable = 6
    hasFour = false
    hasFourVariable = 6
    hasTwo = false
    hasTwoVariable = 6
    chance = 0;
    hasYatzy = false;
    hasYatzyVariable = 6;

    for i in range(5):
        value = allDice[i]
        numberOfNumbers[value-1] += 1
    
    for i in range(5):
        chance += allDice[i]

    if numberOfNumbers[0] > 0:
        result["ettere"] = {playerIndex: str(numberOfNumbers[0])}

    if numberOfNumbers[1] > 0:
        result["toere"] = {playerIndex: str(numberOfNumbers[1] * 2)}
    
    if numberOfNumbers[2] > 0:
        result["treere"] = {playerIndex: str(numberOfNumbers[2] * 3)}
    
    if numberOfNumbers[3] > 0:
        result["firere"] = {playerIndex: str(numberOfNumbers[3] * 4)}
    
    if numberOfNumbers[4] > 0:
        result["femmere"] = {playerIndex: str(numberOfNumbers[4] * 5)}
    
    if numberOfNumbers[5] > 0:
        result["seksere"] = {playerIndex: str(numberOfNumbers[5] * 6)}
    
    while not hasThree and hasThreeVariable > 0:
        if numberOfNumbers[hasThreeVariable - 1] > 2:
            result["treens"] = {playerIndex: hasThreeVariable * 3}
            hasThree = True
        else:
            hasThreeVariable -= 1
    
    while not hasFour and hasFourVariable > 0:
        if numberOfNumbers[hasFourVariable - 1] > 3:
            result["fireens"] = {playerIndex: hasFourVariable * 4}
            hasFour = True
        else:
            hasFourVariable -= 1

    if numberOfNumbers[0] > 0 and numberOfNumbers[1] > 0 and numberOfNumbers[2] > 0 and numberOfNumbers[3] > 0 and numberOfNumbers[4] > 0:
        result["lillestraight"] = {playerIndex: "15"}
    
    if numberOfNumbers[1] > 0 and numberOfNumbers[2] > 0 and numberOfNumbers[3] > 0 and numberOfNumbers[4] > 0 and numberOfNumbers[5] > 0:
        result["storstraight"] = {playerIndex: "20"}

    while not hasTwo and hasTwoVariable > 0:
        if numberOfNumbers[hasTwoVariable - 1] > 1 and hasThreeVariable != hasTwoVariable:
            hasTwo = true
        else:
            hasTwoVariable -= 1
    
    if hasTwo and hasThree and hasTwoVariable > 0 and hasThreeVariable > 0:
        result["fuldthus"] = {playerIndex: hasTwoVariable * 2 + hasThreeVariable * 3}
    
    if chance > 0:
        result["chance"] = {playerIndex: str(chance)}

    while not hasYatzy and hasYatzyVariable > 0:
        if numberOfNumbers[hasYatzyVariable - 1] > 4:
            result["yatzy"] = {playerIndex: hasYatzyVariable * 6 + 50}
            hasYatzy = True
        else:
            hasYatzyVariable -= 1
    
    return result
