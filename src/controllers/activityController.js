
export const getData = async(req, res) =>{
    res.send('Activity get Data')
}

export const addInfo = async(req, res) =>{
    res.send('Add Information')  
}

export const removeInfo = async(req, res) =>{
    res.send('Removing a particular person');

};

export const getInfo = async(req, res) =>{
    res.send('getting info for a particular person');
}

export const updateInfo = async(req, res) =>{
    res.send('updating particular person');

};