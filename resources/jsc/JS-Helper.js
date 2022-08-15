var errors = [];
var validate = function (payload, validations) {
    // print(JSON.stringify(validations));

    for (key in validations) {
        // check if field required
        if (validations[key].required) {
            if (
                typeof payload[validations[key].name] == "undefined" ||
                payload[validations[key].name] == null ||
                payload[validations[key].name] == "" ||
                payload[validations[key].name] == "null" // TODO: this should be highlighted and reviewed by end developer
            ) {
                return generateError("ERR400", "field " + key + ": is required");
            }
        }
        try {
            validations[key].rules.forEach((rule) => {
                switch (rule.condition) {
                    case "regex":
                        if (!rule.regex.test(payload[validations[key].name])) {
                            errors.push(generateError(rule.error, rule.message));
                        }
                        break;
                    case "bigger_than":
                        var vl =
                            typeof rule.value == "number"
                                ? rule.value
                                : GetPropertyValue(payload, rule.value);
                        //TODO: use compare instead
                        if (!(payload[validations[key].name] > vl)) {
                            errors.push(
                                generateError(
                                    rule.error,
                                    parameterizedString(rule.message, [
                                        key,
                                        rule.value,
                                    ])
                                )
                            );
                        }
                        break;
                    case "smaller_than":
                        var vl =
                            typeof rule.value == "number"
                                ? rule.value
                                : GetPropertyValue(payload, rule.value);
                        //TODO: use compare instead
                        if (!(payload[validations[key].name] < vl)) {
                            errors.push(generateError(rule.error,parameterizedString(rule.message, [payload[validations[key].name],rule.value])));
                        }
                        break;
                    case "before_date":
                        var dt = new Date(payload[validations[key].name]);
                        var vl =
                            rule.date instanceof Date
                                ? rule.date
                                : GetPropertyValue(payload, rule.date);

                        if (!(new Date(vl).getTime() > dt.getTime())) {
                            errors.push(generateError(rule.error,parameterizedString(rule.message, [payload[validations[key].name],rule.value])));
                        }
                        break;
                    case "after_date":
                        var dt = new Date(payload[validations[key].name]);
                        var vl =
                            rule.date instanceof Date
                                ? rule.date
                                : GetPropertyValue(payload, rule.date);
                        if (!(new Date(vl).getTime() < dt.getTime())) {
                            errors.push(generateError(rule.error,parameterizedString(rule.message, [payload[validations[key].name],rule.value])));
                        }
                        break;
                    case "in_list":
                        if (
                            rule.value.split("|").includes(String(payload[validations[key].name]))
                        )
                            //TODO: use compare instead
                            break;
                            errors.push(generateError(rule.error,parameterizedString(rule.message, [payload[validations[key].name],rule.value])));
                        break;

                    case "function":
                        id_type = GetPropertyValue(payload, rule.param); // TODO: simplify this
                        if (eval(rule.value)(id_type, payload[validations[key].name])) {
                            errors.push(generateError(rule.error,parameterizedString(rule.message, [payload[validations[key].name],rule.value])));
                        }
                        break;
                    case "required_if":
                        compared_to = GetPropertyValue(payload, rule.key);
                        if (compare(rule._condition, rule.value, compared_to)) {
                            if (isExist(payload, key)) break;
                            message = parameterizedString(rule.message, [
                                key,
                                rule.key,
                                rule.value,
                            ]);
                            errors.push(generateError(rule.error,parameterizedString(rule.message, [payload[validations[key].name],rule.value])));
                        }
                        break;
                    case "compare_with":
                        if (compare(rule._condition, payload[validations[key].name], rule.value))
                            break;
                        message = parameterizedString(rule.message, [
                            key,
                            rule.value,
                        ]);
                        errors.push(generateError(rule.error,parameterizedString(rule.message, [payload[validations[key].name],rule.value])));
                        break;
                }
            });
        } catch (e) {
            return errors;
        }
    }
    // print(JSON.stringify(errors));
    return errors;
};


// START VALIDATOR SCRIPT FROM HERE
// HELPERS
/***
 * @example parameterizedString("my name is %s1 and surname is %s2", "John", "Doe");
 * @return "my name is John and surname is Doe"
 *
 * @firstArgument {String} like "my name is %s1 and surname is %s2"
 * @otherArguments {String | Number}
 * @returns {String}
 */
const parameterizedString = (str, params) => {
    if (!str) return "";
    return str.replace(/%s[0-9]+/g, (matchedStr) => {
        const variableIndex = matchedStr.replace("%s", "") - 1;
        return params[variableIndex];
    });
};

/**
 * @return {structured single errors}
 */
function generateError(code, message) {
    failure = {
        code: code,
        message: message,
    };
    return failure;
}

/**
 * comparison function
 */

function compare(operator, left, right) {
    switch (operator) {
        case "is":
            return left == right;
        case "gt":
            return left > right;
        case "lt":
            return left < right;
        case "gte":
            return left >= right;
        case "lte":
            return left <= right;
        case "in":
            return left.split("|").includes(right);
    }
}
// https://stackoverflow.com/questions/37510640/how-to-get-property-value-from-a-javascript-object
/**
 * return data of dataToRetrieve key in object
 * @param {*} object
 * @param {string} dataToRetrieve
 * @returns value
 */
function GetPropertyValue(object, dataToRetrieve) {
    dataToRetrieve.split(".").forEach(function (token) {
        if (object) object = object[token];
    });

    return object;
}
function validate_id_type(id_type, id_number) {
    switch (id_type) {
        case "NAT":
            return !/^(1)\d{9,9}$/.test(id_number);
        case "IQA":
            return !/^(4|2)\d{9,9}$/.test(id_number);
        default:
            return true;
    }
}
function isExist(payload, key) {
    return !(
        (
            typeof payload[validations[key].name] == "undefined" ||
            payload[validations[key].name] == null ||
            payload[validations[key].name] == "" ||
            payload[validations[key].name] == "null"
        ) // TODO: this should be highlighted and reviewed by end developer
    );
}
// END HELPERS





