import { deleteUserAccount, deleteUserData } from './path/to/your/module';
import { auth, db, EmailAuthProvider, reauthenticateWithCredential, deleteDoc, deleteUser } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  auth: {
    currentUser: {
      email: 'test@example.com',
      uid: 'test-uid',
      displayName: 'testuser'
    }
  },
  db: {},
  EmailAuthProvider: {
    credential: jest.fn()
  },
  reauthenticateWithCredential: jest.fn(),
  deleteDoc: jest.fn(),
  deleteUser: jest.fn(),
}));

describe('deleteUserAccount', () => {
  it('should delete user account and related data successfully', async () => {
    const mockPassword = 'mockPassword';
    const mockUser = { uid: 'test-uid' };

    EmailAuthProvider.credential.mockReturnValue('mockCredential');
    (reauthenticateWithCredential as jest.Mock).mockResolvedValueOnce(null);
    (deleteDoc as jest.Mock).mockResolvedValueOnce(null);
    (deleteUser as jest.Mock).mockResolvedValueOnce(null);

    await deleteUserAccount(mockPassword, mockUser);

    expect(EmailAuthProvider.credential).toHaveBeenCalledWith('test@example.com', mockPassword);
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(auth.currentUser, 'mockCredential');
    expect(deleteDoc).toHaveBeenCalledTimes(2);
    expect(deleteDoc).toHaveBeenCalledWith(expect.anything(), 'users/test-uid');
    expect(deleteDoc).toHaveBeenCalledWith(expect.anything(), 'usernames/testuser');
    expect(deleteUser).toHaveBeenCalledWith(auth.currentUser);
  });

it('should throw an error if no authenticated user', async () => {
    const mockPassword = 'mockPassword';
    const mockUser = { uid: 'test-uid' };
    auth.currentUser = null;

    await expect(deleteUserAccount(mockPassword, mockUser)).rejects.toThrow('No authenticated user');
});