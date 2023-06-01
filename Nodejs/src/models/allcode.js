'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // đây là nơi set quan hệ cho các bảng 
      Allcode.hasMany(models.User, { foreignKey: 'roleId', as: 'roleData' })
      Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
      Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' })

      //doctor infor
      Allcode.hasMany(models.Center_Infor, { foreignKey: 'priceId', as: 'priceTypeData' })
      Allcode.hasMany(models.Center_Infor, { foreignKey: 'paymentId', as: 'paymentTypeData' })
      Allcode.hasMany(models.Center_Infor, { foreignKey: 'provinceId', as: 'provinceTypeData' })

      Allcode.hasMany(models.Booking, { foreignKey: 'timeType', as: 'timeTypeDataPatient' })

    }
  };
  Allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};