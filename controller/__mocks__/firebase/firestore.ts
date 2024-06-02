const mockCollection: any = jest.fn(() => ({
  doc: jest.fn(() => mockDoc),
  get: jest.fn(() => Promise.resolve({ empty: false, docs: [mockDoc] })),
  where: jest.fn(() => mockCollection),
  orderBy: jest.fn(() => mockCollection),
  limit: jest.fn(() => mockCollection),
  add: jest.fn(() => Promise.resolve({ id: "new-doc-id" })),
}));

const mockDoc = {
  collection: mockCollection,
  set: jest.fn(() => Promise.resolve()),
  get: jest.fn(() =>
    Promise.resolve({
      exists: true,
      data: () => ({
        restaurants: [
          { id: "1", name: "Restaurant 1" },
          { id: "2", name: "Restaurant 2" },
        ],
      }),
    })
  ),
  delete: jest.fn(() => Promise.resolve()),
  ref: { id: "mockDocId" },
};

const mockBatch = {
  delete: jest.fn(),
  commit: jest.fn(() => Promise.resolve()),
};

const mockFirestore = {
  collection: mockCollection,
  batch: jest.fn(() => mockBatch),
};

export default jest.fn(() => mockFirestore);
