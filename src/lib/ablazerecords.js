const AblazeMakeRecords = (t, e) => e.reduce((e, r) => ((e[r[t]] = r), e), {});
(AblazeMakeRecords.dynamicSort = (t) => {
  let e = 1;
  return (t[0] === '-' && ((e = -1), (t = t.substr(1))), function(r, _) {
    return (r[t] < _[t] ? -1 : r[t] > _[t] ? 1 : 0) * e
  })
}), (AblazeMakeRecords.dynamicSortMultiple = (...t) => function(e, r) {
  for (var _ = 0, n = 0, s = t.length; n === 0 && _ < s;)(n = AblazeMakeRecords.dynamicSort(t[_])(e, r)), _++;
  return n
}),
(AblazeMakeRecords.search_by = (t, e, r, _) => (_ ? t.filter((t) => String(t[e]).startsWith(String(r))) : t.filter((t) => String(t[e]).toLowerCase().includes(String(r).toLowerCase())))), (AblazeMakeRecords.search_by_not = (t, e, r, _) => (_ ? t.filter((t) => !String(t[e]).startsWith(String(r))) : t.filter((t) => !String(t[e]).toLowerCase().includes(String(r).toLowerCase()), ))),
(AblazeMakeRecords.group_by = function(t, e) {
  return t.reduce((t, r) => ((t[r[e]] = t[r[e]] || []).push(r), t), {})
});
AblazeMakeRecords.updates_only = function(e, t) {
  let r;
  let _;
  let n;
  let s;
  let i;
  if (JSON.stringify(e) === JSON.stringify(t)) return !1;
  for (r = [], _ = s = 0, i = t.length; s < i; _ = ++s)(n = t[_]), JSON.stringify(n) !== JSON.stringify(e[_]) && r.push(n);
  return r
};
AblazeMakeRecords.updated_values = function(original, updates) {
  const UPDATED = {};
  Object.keys(original).forEach((k) => {
    if (original[k] !== updates[k]) {
      UPDATED[k] = updates[k]
    }
  });
  return UPDATED
};
class AblazeBaseRecords {
  constructor(t) {
    this.list = t
  }
  get keys() {
    const t = this.list;
    return t.length > 0 ? Object.keys(t[0]) : []
  }
  head(t = 10) {
    return this.list.slice(0, t)
  }
  tail(t = 10) {
    return this.list.reverse().slice(0, t).reverse()
  }
  by(t = 'id') {
    return AblazeMakeRecords(t, this.list)
  }
  sort(...t) {
    return this.list.sort(AblazeMakeRecords.dynamicSortMultiple(...t), )
  }
  group_by(t = 'account_id') {
    return AblazeMakeRecords.group_by(this.list, t)
  }
  find(t, e) {
    return this.list.filter((r) => r[t] === e)
  }
  find_not(t, e) {
    return this.list.filter((r) => r[t] !== e)
  }
  search(t, e, r = !1) {
    let _ = [];
    return (t && typeof t === 'object' && t.constructor === Array ? t.forEach((t) => {
      _ = _.concat(AblazeMakeRecords.search_by(this.list, t, e, r), )
    }) : (_ = AblazeMakeRecords.search_by(this.list, t, e, r)), _)
  }
  search_not(t, e, r = !1) {
    let _ = [];
    return (t && typeof t === 'object' && t.constructor === Array ? t.forEach((t) => {
      _ = _.concat(AblazeMakeRecords.search_by_not(this.list, t, e, r), )
    }) : (_ = AblazeMakeRecords.search_by_not(this.list, t, e, r, )), _)
  }
  dirty(t) {
    const e = this.list;
    return AblazeMakeRecords.updates_only(e, t)
  }
  dirty_form(e, t) {
    return AblazeMakeRecords.updated_values(e, t)
  }
};
const AblazeRecords = (e = []) => new AblazeBaseRecords(e, null);

$ablaze.records = AblazeRecords;
