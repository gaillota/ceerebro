import { Picker } from 'meteor/meteorhacks:picker';

import { bootstrap } from '../../api/users/methods';

Picker.route('/bootstrap', (params, req, res) => {
    bootstrap.call((error, result) => {
        res.end(result);
    });
});