/*
    Text option class (string input)
    Author: Tar van Krieken
    Starting Date: 02/06/2018
*/
class TextOption extends Option{
    constructor(name, value){
        super(name, "text", value instanceof Object? value.value: value);
    }
}
