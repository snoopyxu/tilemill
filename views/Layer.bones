view = Backbone.View.extend();

view.prototype.events = {
    'click .layerFile input[type=submit]': 'saveFile',
    'click .layerPostGIS input[type=submit]': 'savePostGIS'
};

view.prototype.initialize = function(options) {
    _(this).bindAll('render', 'saveFile', 'savePostGIS');
    this.render();
};

view.prototype.render = function() {
    this.$('.content').html(templates.Layer(this.model));
    return this;
};

view.prototype.saveFile = function() {
    var datasource = new models.Datasource();
    var attr = {
            id: this.$('input[name=id]').val(),
            project: this.model.collection.parent.get('id'),
            file: this.$('input[name=file]').val()
    }
    var options = { error: function(m, e) { new views.Modal(e); } };
    if (datasource.set(attr, options)) {
        $(this.el).addClass('loading');
        datasource.fetch({
            success: _(function() {
                var attr = {
                    'id':    this.$('input[name=id]').val(),
                    'name':  this.$('input[name=id]').val(),
                    'srs':   this.$('input[name=srs]').val(),
                    'class': this.$('input[name=class]').val(),
                    'geometry': datasource.get('geometry_type'),
                    'Datasource': {
                        'file': this.$('input[name=file]').val()
                    }
                };
                var options = { error: function(m, e) { new views.Modal(e); } };
                if (this.model.set(attr, options)) {
                    if (!this.model.collection.include(this.model))
                        this.model.collection.add(this.model);
                    this.$('.close').click();
                }
                $(this.el).removeClass('loading');
            }).bind(this),
            error: _(function(m, e) {
                new views.Modal(e);
                $(this.el).removeClass('loading');
            }).bind(this)
        });
    }
    return false;
};

view.prototype.savePostGIS = function() {
    var attr = {
        'id':    this.$('input[name=id]').val(),
        'name':  this.$('input[name=id]').val(),
        'srs':   this.$('input[name=srs]').val(),
        'class': this.$('input[name=class]').val(),
        'Datasource': {
            'host':     this.$('input[name=host]', this.el).val(),
            'port':     this.$('input[name=port]', this.el).val(),
            'database': this.$('input[name=database]', this.el).val(),
            'username': this.$('input[name=username]', this.el).val(),
            'password': this.$('input[name=password]', this.el).val(),
            'dbname':   this.$('input[name=dbname]', this.el).val(),
            'table':    this.$('textarea[name=table]', this.el).val(),
            'geometry_field': this.$('input[name=geometry_field]', this.el).val(),
            'extent':   this.$('input[name=extent]', this.el).val(),
            'type': 'postgis'
        }
    };
    var options = { error: function(m, e) { new views.Modal(e); } };
    if (this.model.set(attr, options)) {
        if (!this.model.collection.include(this.model))
            this.model.collection.add(this.model);
        this.$('.close').click();
    }
    return false;
};