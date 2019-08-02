//Cache of points which will be delivered to DB
const pointCache = {};

//Add points to the cache
function cachePoints(uid, quantity) {
    //Check if user is already in the pool
    var points = 0;
    if(pointCache[uid])
        points = pointCache[uid];
    pointCache[uid] = points + quantity;
}

cachePoints(250061071967191041, 5);
cachePoints(250061071967191041, 5);

console.log(pointCache);
