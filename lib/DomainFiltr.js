var DomainFiltr = function(domains, action) {
    this.domains = domains;
    this.action = action;
};

DomainFiltr.prototype.filtr = function(data) {
    var result = false;
    var that = this;
    for (var i = 0, len = this.domains.length; i < len; i++) {
        domain = this.domains[i];
        if (data.domain == domain) {
            if (that.action == DomainFiltr.ACTIONS.LEAVE) {
                result = false;
                break;
            } else {
                result = true;
            }
        } else {
            if (that.action == DomainFiltr.ACTIONS.DELETE) {
                result = false
            } else {
                result = true;
            }
        }
    }
    console.info('DomainFiltr/filtr result = %s domin = %s',result, data.domain);
    return result;
}

DomainFiltr.ACTIONS = {};
DomainFiltr.ACTIONS.DELETE = 'delete from set';
DomainFiltr.ACTIONS.LEAVE = 'leave in set';

exports.DomainFiltr = DomainFiltr;
