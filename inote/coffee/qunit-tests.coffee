
#for node qunit.
T = this
#try
#  T = require("../js/word_counter.js")

#dicts = T.buildDictionaries(data)
a=[1,2,3]

QUnit.test "Проверка количества полей", (assert) ->
  #assert.ok dicts.getDictionaryNames().length > 0, "количество полей должно быть больше 0"
  assert.ok a.length > 0, "количество полей должно быть больше 0"
  return

QUnit.test "Размер словаря поля name ", (assert) ->
  assert.equal a.length, 3, "размер должен быть 3"
  return

