fields = context.getVariable("SF-PayloadValidator.fields");
payload = JSON.parse(context.getVariable("message.content"));
result = validate(payload, fields);
length = result.length;
result = JSON.stringify(result);

if(length > 0){
    context.setVariable("message.content", result);
    context.setVariable('flag', true);
}
