const { EventEmitter } = require('events');
class State extends EventEmitter {
  constructor() {
    super();
    this.state = {}
  }

  /**
   * Starts a countdown timer for a user.
   * If a timer is already exists, it will remove it and start over.
   * If no images are found, it will remove the timer.
   * After the timeout, it'll post all the pictures saved to that user.
   * @param {String} id Discord user id
   */
  _timer(id) {
    const user = this.state[id];
    if (user.timer) clearTimeout(user.timer);
    if (!user.images.length) return;
    user.timer = setTimeout(() => {
      if (user.images.length > 0){
        this.emit('post', { id, user })
      } else {
        console.log('Tried to post images, but no images were found.');
      }
    }, 300000);
  }

  /**
   * Given a media_id, adds it to a user. Initializes user if it does not yet exist.
   * @param {ArrayBuffer} image Byte array of the image
   * @param {Object} user id and username of a Discord user
   */
  addToUser(media_id, message_id, { id, username }) {
    // Initializes an object if the user doesn't exist in state yet.
    
    if (!this.state[id]) this.state[id] = { images: [], timer: null, username };
    this.state[id].images.push({ media_id, message_id });
    
    if (this.state[id].images.length >= 4) {
      return this.emit('post', { id, user: this.state[id] });
      //console.log('Here the images should be posted', this.state[id].images.length);
      //this.resetUser(id);
    }

    this._timer(id);
    return this.state[id];
  }

  resetUser(id) {
    if (this.state[id]) {
      console.log("Resetting user");
      this.state[id].images = [];
      delete this.state[id];
    }
  }

  /**
   * Checks if a user inside state is 'full', meaning they have 4 images.
   * @param {String} id Discord user id
   */
  userIsFull(id) {
    if (!this.state[id]) return false;
    return this.state[id].images.length === 4
  }
}

module.exports = State;