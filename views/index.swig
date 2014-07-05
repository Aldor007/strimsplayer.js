{% extends "layout.swig" %}

{% block title%}
strimsplayer.pl
{% endblock %}

{% block body %}

{% block hero-unit %}
      <div class='main'>
        <div class="hero-unit">
         <h1>Strimsplayer.</h1>
            <p>Player dla strimsa.</p>
            <p><a href="http://strims.pl/s/strimsplayer" class="btn btn-primary btn-large">Dowiedz się więcej</a></p>
          </div>
    {% endblock %}
          {%block header %}     <h2>Ostatnio dodane  </h2>{%endblock%}
          <p> Sortowanie  
</p>
<div class="span9">
    <div class="songsinfo">
</div>

<div class="span5">
    <div class="player">
            <div class="youtube-player-video">
                    <div class="youtube-player-object">
                            You need Flash player 8+ and JavaScript enabled.
                    </div>
            </div>
    </div>
</div>
<div class="span6">
        <div id="playlist"></div>

</div>


{# display navigation #}
<div class="span9">
    
</div>


      </div>
        {% endblock %}

