//thay đổi colum đã có 
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};


//add colum 
// module.exports = {
//     //sẽ up thêm colum 
//     up: function(queryInterface, Sequelize) {
//       // logic for transforming into the new state
//       return queryInterface.addColumn(
//         'User',
//         'avatar',
//        Sequelize.BOOLEAN
//       );
  
//     },
  
//     //remove colum
//     down: function(queryInterface, Sequelize) {
//       // logic for reverting the changes
//       return queryInterface.removeColumn(
//         'Todo',
//         'completed'
//       );
//     }
//   }