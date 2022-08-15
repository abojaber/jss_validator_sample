## Usage


to use the sharedflow you need to include two policies in your proxy:

1. javascript and give it this example to validate

```javascript
fields = [
        {
        "name": "age",
        "type": "regex_number",
        "required": true,
        "rules": [
            {
                "regex":/^\\d{2,2}$/,
                "condition": "regex",
                "error": "NB0001",
                "message": "age field should be 2 digit-1"
            },
            {
                "regex":/^\\d{2,2}$/,
                "condition": "regex",
                "error": "NB0002",
                "message": "age field should be 2 digit-2"
            }
        ]
    },

    {
        "name": "price",
        "type": "regex_float",
        "required": true,
        "rules": [
            {
                "condition": "regex",
                "regex": /^\d+.?\d{0,2}$/,
                "error": "FT0001",
                "message": "price Field should be a decimal-1"
            },
                        {
                "condition": "regex",
                "regex": /^\d+.?\d{0,2}$/,
                "error": "FT0002",
                "message": "price Field should be a decimal-2"
            }
        ]
    },
    {
        "name": "email",
        "type": "regex_email",
        "required": true,
        "rules": [
            {
                "condition": "regex",
                "regex": /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                "error": "ST0001",
                "message": "email field should be valid Email"
            }
        ]
    }
];


context.setVariable("fields", fields);
```

2. flow callout