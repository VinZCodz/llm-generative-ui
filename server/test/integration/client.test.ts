describe(`Turso DB client test suite: to test actual application connections`, () => {
    describe(`Given READ-ONLY client`, () => {
        it.todo('should fetch records from db, DQL allowed.', async () => {
            // Arrange
            // get direct ro con from client

            // Act
            // query db: roDB.query.expenseTable.findMany()

            // Assert
            // query succeeded

        });

        it.todo('should NOT be able to manipulate data. DML NOT allowed!', async () => {
           // Arrange
            // get direct ro con from client

            // Act
            // query db: insert or delete

            // Assert
            // query failed

            // Verify in DB for any manipulation.
        });

        it.todo('should NOT be able to create db objects. DDL NOT allowed!', async () => {
           // Arrange
            // get direct ro con from client

            // Act
            // query db: create or describe

            // Assert
            // query failed

            // Verify in DB for any creation.
        });
    });

    describe(`Given FULL client`, () => {
        it.todo('should fetch records from db, DQL allowed.', async () => {
            // Arrange
            // get direct ro con from client

            // Act
            // query db: roDB.query.expenseTable.findMany()

            // Assert
            // query succeeded

        });

        it.todo('should manipulate data. DML allowed.', async () => {
           // Arrange
            // get direct ro con from client

            // Act
            // query db: insert or delete

            // Assert
            // query succeeded

            // Verify in DB for manipulation.
        });

        it.todo('should create db objects. DDL allowed.', async () => {
           // Arrange
            // get direct ro con from client

            // Act
            // query db: create or describe

            // Assert
            // query succeeded

            // Verify in DB for creation.
        });
    })
});