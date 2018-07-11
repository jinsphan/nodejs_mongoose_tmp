const regexOptions = {
    required: {
        regex: "^.+$",
        message: 'can not empty'
    },
    string: {
        regex: "^[a-zA-Z0-9]*$",
        message: 'only contain a-z, A-Z and 0-9',
    },
    free_string: {
        regex: "^[a-zA-Z0-9\\s]*$",
        message: "only contain a-z, A-Z, 0-9 and white space",
    },
    number: {
        regex: "^[0-9]*$",
        message: "must be a number"
    },
    min: (_data, num) => {
        return _execRegex(
            `^.{${num},}$`,
            _data,
            res => res !== null ? false : `must be longer than ${num} character`
        );
    },
    max: (_data, num) => {
        return _execRegex(
            `^.{0,${num}}$`,
            _data,
            res => res !== null ? false : `must be lower than ${num} character`
        );
    },
    enum: (_data, list) => {
        if (~list.split(",").indexOf(_data)) {
            return false;
        }
        return `must be in ${list}`;
    }
}

function _execRegex(regex, data, getMessage) {
    const _regex = new RegExp(regex, 'g');
    return getMessage(_regex.exec(data));
}

function validate(data, rule) {
    let errors = {};

    Object.keys(rule).forEach(type => {
        if (data[type] === undefined) data[type] = "";
        let _errors = rule[type].split("|").map(rule_item => {
            if (!~rule[type].indexOf('required') && data[type] === "") { return false; }

            if (~rule_item.indexOf("=")) {
                let rule_item_split = rule_item.split("=");
                let message = regexOptions[rule_item_split[0]](data[type], rule_item_split[1]);
                return message;
            }

            return _execRegex(
                regexOptions[rule_item].regex,
                data[type],
                res => res ? false : regexOptions[rule_item].message
            );

        }).filter(item => item !== false);

        if (_errors.length > 0) {
            errors[type] = _errors;
        }
    })

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}

module.exports = {
    _vldUserRegister: (data) => {
        const rule = {
            username: "required|string|min=3|max=150",
            password: "required|string|min=3|max=150",
            fullname: "free_string|min=3|max=150",
            role: "number|enum=1,2",
            phone: "number|min=10|max=11",
        }
        return validate(data, rule);
    },
}
