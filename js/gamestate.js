//	source: "https://gist.github.com/thecoshman/37d14c27ce21c12e40b2a84a94a14755".

(function() {
    var Game = window.Game = window.Game || {};

    //
    // Contrary to what 'gamescreen.js' says, this is the primary state holding class.
    // It will handle all updates to the internal state of the game.
    // No other code should try to modify state, it should be directed through this class
    // This class should not think about anything else, such as rendering or input or networking
    // It simply needs to ensure it stores a model of the game world as acurately as it possibly can.
    //

    // Create an initial gamestate object that is ready to go.
    Game.GameState = function(){
        var self = this;
        var "alivePlayers" : [];
        var "aliveBulltes" : [];
        var "tickPeriod" : 1.0/60;
        var "playerArea" : new Victor(500,500);

        self.update = function() {
            // TODO pass correkt data to update funcitons
            updatePlayerStates();
            updateBulletStates();
            doBulletCollisionChecks();
        }

        self.updatePlayerStates = function(oldAlivePlayersState) {
            var alivePlayers = game.alivePlayers = game.alivePlayers || [];
            alivePlayers.forEach(function(player) {
                player.position.x += player.direction.x * welcome.speed;
                player.position.y += player.direction.y * welcome.speed;
            });
        };

        self.updateBulletStates = function(oldState) {
            game.aliveBullets.forEach(function(bullet) {
                bullet.position.x += bullet.aim.x * welcome.bulletSpeed;
                bullet.position.y += bullet.aim.y * welcome.bulletSpeed;
            });
        };

        self.doBulletCollisionChecks = function(oldState) {
            var killedPlayers = [];
            var destroyedBullets = [];
            game.aliveBullets.forEach(function(bullet) {
                if(bulletOutOfBounds(bullet)){
                    destroyedBullets.push(bullet.id);
                    return; // if the bullet just went OOB, no point checking for player hits... right?
                }
                game.alivePlayers.forEach(function(player) {
                    if(bulletHitPlayer(bullet, player)){
                        destroyedBullets.push(bullet.id);
                        killedPlayers.push(player.id);
                    }
                });
            });
            game.alivePlayers = game.alivePlayers.filter(function(player) {
                return !killedPlayers.contains(player.id);
            });
            game.aliveBullets = game.aliveBullets.filter(function(bullet) {
                return !destroyedBullet.contains(bullet.id);
            });
        };

        self.bulletOutOfBounds = function(bullet) {
            var pos = bullet.position;
            return pos.x < 0 || pos.y < 0 || pos.x > canvas.size.x || pos.y > canvas.size.y;
        }

        self.bulletHitPlayer = function(bullet, player) {
            var distanceSq = bullet.distanceSq(player);
            var collisionRange = welcomeMessage.size + welcomeMessage.bulletSize;
            // calculation is done on distance squared as it avoids the relatively costly square toot
            return distanceSq < collisionRange * collisionRange;
        }

        return self;
    }
})();