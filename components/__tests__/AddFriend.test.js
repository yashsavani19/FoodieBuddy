const FriendsList = require('./friendsList');

describe('Friends List Functionality', () => {
  let list;

  beforeEach(() => {
    list = new FriendsList();
  });

  test('should add a friend successfully', () => {
    list.addFriend({ id: 1, username: 'gizzagander' });
    expect(list.getFriends().length).toBe(1);
    expect(list.getFriends()[0]).toEqual({ id: 1, username: 'gizzagander' });
  });

  test('should not add a duplicate friend', () => {
    list.addFriend({ id: 1, username: 'John Doe' });
    list.addFriend({ id: 1, username: 'John Doe' });
    expect(list.getFriends().length).toBe(1);
  });

  test('should handle adding a friend with invalid data', () => {
    expect(() => list.addFriend({ id: null, username: '' })).toThrow('Invalid friend data');
  });

  test('should remove a friend successfully', () => {
    list.addFriend({ id: 1, username: 'John Doe' });
    list.removeFriend(1);
    expect(list.getFriends().length).toBe(0);
  });

  test('should retrieve the friends list', () => {
    list.addFriend({ id: 1, username: 'John Doe' });
    expect(list.getFriends()).toEqual([{ id: 1, username: 'John Doe' }]);
  });

  test('should handle friend not found', () => {
    expect(() => list.removeFriend(2)).toThrow('Friend not found');
  });
});
